import { env } from "cloudflare:workers";
import type { ChatGPTUser } from "@/app/chatgpt-auth";
import { createId } from "@/lib/ids";
import type { LiveReadinessResult, ReadinessFinding } from "@/lib/live-readiness";

type Workspace = { organizationId: string; userId: string; email: string; displayName: string };

export type StoredFinding = ReadinessFinding & { id: string };

export type StoredScan = {
  id: string;
  organizationId: string;
  siteId: string;
  host: string;
  displayName: string;
  status: string;
  scanKind: string;
  methodologyVersion: string;
  language: string;
  country: string;
  readinessScore: number | null;
  actualVisibilityStatus: string;
  confidence: number | null;
  issueCount: number;
  criticalCount: number;
  sourceUrl: string;
  finalUrl: string | null;
  httpStatus: number | null;
  bytesFetched: number;
  requestCount: number;
  errorMessage: string | null;
  completedAt: string | null;
  createdAt: string;
  findings: StoredFinding[];
  categoryScores: Record<string, number>;
};

function database() {
  if (!env.DB) throw new Error("Product storage is temporarily unavailable.");
  return env.DB;
}

function workspaceName(user: ChatGPTUser) {
  const base = user.fullName?.trim() || user.email.split("@")[0] || "Recomvia";
  return `${base} workspace`.slice(0, 100);
}

export async function ensureWorkspace(user: ChatGPTUser): Promise<Workspace> {
  const db = database();
  await db.prepare(`
    INSERT INTO users (id, email, display_name)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      updated_at = CURRENT_TIMESTAMP
  `).bind(user.userId, user.email.toLowerCase(), user.fullName || user.displayName).run();

  const existing = await db.prepare(`
    SELECT m.organization_id AS organizationId
    FROM organization_members m
    WHERE m.user_id = ?
    ORDER BY m.created_at ASC
    LIMIT 1
  `).bind(user.userId).first<{ organizationId: string }>();

  const organizationId = existing?.organizationId || `org_${user.userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 42)}`;
  if (!existing) {
    await db.batch([
      db.prepare(`
        INSERT INTO organizations (id, name, owner_user_id)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO NOTHING
      `).bind(organizationId, workspaceName(user), user.userId),
      db.prepare(`
        INSERT INTO organization_members (organization_id, user_id, role)
        VALUES (?, ?, 'owner')
        ON CONFLICT(organization_id, user_id) DO NOTHING
      `).bind(organizationId, user.userId),
    ]);
  }
  return { organizationId, userId: user.userId, email: user.email, displayName: user.displayName };
}

export async function getOrCreateSite(workspace: Workspace, input: { host: string; normalizedUrl: string; language: string; country: string }) {
  const db = database();
  const existing = await db.prepare(`
    SELECT id, organization_id AS organizationId, host, normalized_url AS normalizedUrl,
      display_name AS displayName, default_language AS defaultLanguage, default_country AS defaultCountry
    FROM sites WHERE organization_id = ? AND host = ? LIMIT 1
  `).bind(workspace.organizationId, input.host).first<{
    id: string; organizationId: string; host: string; normalizedUrl: string; displayName: string; defaultLanguage: string; defaultCountry: string;
  }>();
  if (existing) {
    await db.prepare(`
      UPDATE sites SET normalized_url = ?, default_language = ?, default_country = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organization_id = ?
    `).bind(input.normalizedUrl, input.language, input.country, existing.id, workspace.organizationId).run();
    return { ...existing, normalizedUrl: input.normalizedUrl, defaultLanguage: input.language, defaultCountry: input.country };
  }
  const id = createId("site");
  await db.prepare(`
    INSERT INTO sites (id, organization_id, host, normalized_url, display_name, default_language, default_country)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, workspace.organizationId, input.host, input.normalizedUrl, input.host, input.language, input.country).run();
  return { id, organizationId: workspace.organizationId, host: input.host, normalizedUrl: input.normalizedUrl, displayName: input.host, defaultLanguage: input.language, defaultCountry: input.country };
}

function scanSelect() {
  return `
    SELECT s.id, s.organization_id AS organizationId, s.site_id AS siteId,
      w.host, w.display_name AS displayName, s.status, s.scan_kind AS scanKind,
      s.methodology_version AS methodologyVersion, s.language, s.country,
      s.readiness_score AS readinessScore, s.actual_visibility_status AS actualVisibilityStatus,
      s.confidence, s.issue_count AS issueCount, s.critical_count AS criticalCount,
      s.source_url AS sourceUrl, s.final_url AS finalUrl, s.http_status AS httpStatus,
      s.bytes_fetched AS bytesFetched, s.request_count AS requestCount,
      s.error_message AS errorMessage, s.completed_at AS completedAt, s.created_at AS createdAt
    FROM scans s
    JOIN sites w ON w.id = s.site_id
  `;
}

async function findingsForScan(scanId: string) {
  const result = await database().prepare(`
    SELECT id, code, category, severity, status, title, explanation, evidence,
      source_url AS sourceUrl, weight, awarded_points AS awardedPoints, sort_order AS sortOrder
    FROM scan_findings
    WHERE scan_id = ?
    ORDER BY sort_order ASC
  `).bind(scanId).all<StoredFinding>();
  return result.results;
}

function computeCategoryScores(findings: StoredFinding[]) {
  const output: Record<string, number> = {};
  for (const finding of findings) {
    const bucket = output[finding.category] || 0;
    output[finding.category] = bucket + finding.weight;
  }
  for (const category of Object.keys(output)) {
    const rows = findings.filter((finding) => finding.category === category);
    const possible = rows.reduce((sum, finding) => sum + finding.weight, 0);
    const awarded = rows.reduce((sum, finding) => sum + finding.awardedPoints, 0);
    output[category] = possible ? Math.round((awarded / possible) * 100) : 0;
  }
  return output;
}

async function hydrateScan(row: Omit<StoredScan, "findings" | "categoryScores"> | null): Promise<StoredScan | null> {
  if (!row) return null;
  const findings = await findingsForScan(row.id);
  return { ...row, findings, categoryScores: computeCategoryScores(findings) };
}

export async function findCachedScan(workspace: Workspace, cacheKey: string) {
  const row = await database().prepare(`${scanSelect()}
    WHERE s.organization_id = ? AND s.cache_key = ? AND s.status = 'completed'
      AND s.created_at >= datetime('now', '-24 hours')
    ORDER BY s.created_at DESC LIMIT 1
  `).bind(workspace.organizationId, cacheKey).first<Omit<StoredScan, "findings" | "categoryScores">>();
  return hydrateScan(row);
}

export async function countRecentScans(workspace: Workspace) {
  const row = await database().prepare(`
    SELECT COUNT(*) AS count FROM scans
    WHERE organization_id = ? AND created_at >= datetime('now', '-24 hours')
  `).bind(workspace.organizationId).first<{ count: number }>();
  return Number(row?.count || 0);
}

export async function createRunningScan(input: {
  workspace: Workspace; siteId: string; sourceUrl: string; language: string; country: string; cacheKey: string; methodologyVersion: string;
}) {
  const id = createId("scan");
  await database().prepare(`
    INSERT INTO scans
      (id, organization_id, site_id, requested_by_user_id, methodology_version, language, country, source_url, cache_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, input.workspace.organizationId, input.siteId, input.workspace.userId, input.methodologyVersion,
    input.language, input.country, input.sourceUrl, input.cacheKey).run();
  return id;
}

export async function completeScan(workspace: Workspace, scanId: string, result: LiveReadinessResult) {
  const db = database();
  const statements = [
    db.prepare(`
      UPDATE scans SET status = 'completed', readiness_score = ?, actual_visibility_status = ?, confidence = ?,
        issue_count = ?, critical_count = ?, final_url = ?, http_status = ?, bytes_fetched = ?, request_count = ?,
        completed_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organization_id = ?
    `).bind(result.readinessScore, result.actualVisibilityStatus, result.confidence, result.issueCount,
      result.criticalCount, result.finalUrl, result.httpStatus, result.bytesFetched, result.requestCount,
      scanId, workspace.organizationId),
    ...result.findings.map((finding) => db.prepare(`
      INSERT INTO scan_findings
        (id, scan_id, code, category, severity, status, title, explanation, evidence, source_url, weight, awarded_points, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(createId("finding"), scanId, finding.code, finding.category, finding.severity, finding.status,
      finding.title, finding.explanation, finding.evidence, finding.sourceUrl, finding.weight,
      finding.awardedPoints, finding.sortOrder)),
    db.prepare(`
      INSERT INTO cost_ledger
        (id, organization_id, scan_id, category, provider, units, cost_micros, metadata_json)
      VALUES (?, ?, ?, 'crawl', 'direct_fetch', ?, 0, ?)
    `).bind(createId("cost"), workspace.organizationId, scanId, result.requestCount,
      JSON.stringify({ bytesFetched: result.bytesFetched, methodologyVersion: result.methodologyVersion })),
    db.prepare(`
      INSERT INTO audit_logs (id, organization_id, actor_user_id, action, target_type, target_id, metadata_json)
      VALUES (?, ?, ?, 'scan.completed', 'scan', ?, ?)
    `).bind(createId("audit"), workspace.organizationId, workspace.userId, scanId,
      JSON.stringify({ readinessScore: result.readinessScore, issueCount: result.issueCount })),
  ];
  await db.batch(statements);
  return getScanForUser(workspace.userId, scanId);
}

export async function failScan(workspace: Workspace, scanId: string, message: string) {
  await database().prepare(`
    UPDATE scans SET status = 'failed', error_message = ?, completed_at = CURRENT_TIMESTAMP
    WHERE id = ? AND organization_id = ?
  `).bind(message.slice(0, 500), scanId, workspace.organizationId).run();
}

export async function getScanForUser(userId: string, scanId: string) {
  const row = await database().prepare(`${scanSelect()}
    JOIN organization_members m ON m.organization_id = s.organization_id
    WHERE s.id = ? AND m.user_id = ? LIMIT 1
  `).bind(scanId, userId).first<Omit<StoredScan, "findings" | "categoryScores">>();
  return hydrateScan(row);
}

export async function getLatestScanForUser(userId: string) {
  const row = await database().prepare(`${scanSelect()}
    JOIN organization_members m ON m.organization_id = s.organization_id
    WHERE m.user_id = ? AND s.status = 'completed'
    ORDER BY s.created_at DESC LIMIT 1
  `).bind(userId).first<Omit<StoredScan, "findings" | "categoryScores">>();
  return hydrateScan(row);
}

export async function listScansForUser(userId: string, limit = 20) {
  const result = await database().prepare(`${scanSelect()}
    JOIN organization_members m ON m.organization_id = s.organization_id
    WHERE m.user_id = ?
    ORDER BY s.created_at DESC LIMIT ?
  `).bind(userId, Math.max(1, Math.min(50, limit))).all<Omit<StoredScan, "findings" | "categoryScores">>();
  return result.results;
}

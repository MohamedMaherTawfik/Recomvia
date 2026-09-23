import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/app/components/policy-page";
import { SITE_URL } from "@/lib/articles";

export const metadata: Metadata = {
  title: { absolute: "Recomvia Privacy & Beta Data Notice" },
  description: "What Recomvia collects and why during the private beta.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return <PolicyPage eyebrow="Trust center" title="Privacy & Beta Data Notice" intro="This notice describes the data used by the current private beta. It will be replaced by market-specific production terms before public paid launch.">
    <PolicySection title="Data we use"><p>When you sign in, the hosting platform can provide a stable user identifier, email address, and optional display name. When you request a scan, Recomvia stores the website address, chosen language and country, fetched public-page evidence, results, timestamps, methodology version, and operational request counts.</p><p>Support requests can include your name, email, question, source page, status, and the human reply. A private ticket access key may be stored in your browser so the same browser can retrieve the response.</p></PolicySection>
    <PolicySection title="Why we use it"><p>We use this information to provide and secure the beta, save account-owned reports, reuse recent scans, diagnose failures, measure operating cost, prevent abuse, and answer support requests. Recomvia does not sell personal data.</p></PolicySection>
    <PolicySection title="Website scanning"><p>Only submit public websites that you are authorized to analyze. The current scanner retrieves the submitted public page, robots.txt, and an available XML sitemap. It does not bypass authentication, paywalls, or access controls, and it does not claim to test consumer AI answers.</p></PolicySection>
    <PolicySection title="Retention and deletion"><p>Private-beta records are retained while they are needed to operate and evaluate the beta. Before public launch, Recomvia will publish and enforce a production retention schedule covering account data, reports, evidence, support records, backups, and cost logs. You may request access or deletion through the <Link href="/contact" className="font-bold text-blue-700">contact page</Link>.</p></PolicySection>
    <PolicySection title="Service providers and security"><p>Recomvia uses infrastructure and service providers necessary to host the application, store records, authenticate visitors, and operate support. Access to customer reports is checked on the server against the signed-in user’s organization. No online service can promise absolute security; material incidents will be investigated and handled under the production incident policy before public launch.</p></PolicySection>
    <PolicySection title="Changes"><p>This notice is versioned for the private beta. Material changes will be shown with a new effective date. Paid service, external analytics, advertising trackers, new AI providers, or direct website modification will not be activated silently; the relevant notice and consent flow will be updated first.</p></PolicySection>
  </PolicyPage>;
}

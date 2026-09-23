CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`actor_user_id` text,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_organization_created` ON `audit_logs` (`organization_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `cost_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`scan_id` text,
	`category` text NOT NULL,
	`provider` text NOT NULL,
	`units` integer DEFAULT 0 NOT NULL,
	`cost_micros` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scan_id`) REFERENCES `scans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_cost_ledger_scan` ON `cost_ledger` (`scan_id`);--> statement-breakpoint
CREATE INDEX `idx_cost_ledger_organization_created` ON `cost_ledger` (`organization_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `credit_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`fix_id` text,
	`delta` integer NOT NULL,
	`kind` text NOT NULL,
	`reference_type` text NOT NULL,
	`reference_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fix_id`) REFERENCES `fixes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_credit_ledger_idempotency` ON `credit_ledger` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `idx_credit_ledger_organization_created` ON `credit_ledger` (`organization_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `fixes` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`site_id` text NOT NULL,
	`scan_id` text,
	`finding_id` text,
	`kind` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`credits` integer DEFAULT 0 NOT NULL,
	`before_value` text,
	`after_value` text,
	`approved_by_user_id` text,
	`approved_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scan_id`) REFERENCES `scans`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`finding_id`) REFERENCES `scan_findings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_fixes_organization_status` ON `fixes` (`organization_id`,`status`);--> statement-breakpoint
CREATE TABLE `organization_members` (
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'owner' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`organization_id`, `user_id`),
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_organization_members_user` ON `organization_members` (`user_id`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`owner_user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_organizations_owner` ON `organizations` (`owner_user_id`);--> statement-breakpoint
CREATE TABLE `scan_findings` (
	`id` text PRIMARY KEY NOT NULL,
	`scan_id` text NOT NULL,
	`code` text NOT NULL,
	`category` text NOT NULL,
	`severity` text NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL,
	`explanation` text NOT NULL,
	`evidence` text NOT NULL,
	`source_url` text NOT NULL,
	`weight` integer NOT NULL,
	`awarded_points` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`scan_id`) REFERENCES `scans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_scan_findings_scan_order` ON `scan_findings` (`scan_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_scan_findings_scan_code` ON `scan_findings` (`scan_id`,`code`);--> statement-breakpoint
CREATE TABLE `scans` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`site_id` text NOT NULL,
	`requested_by_user_id` text NOT NULL,
	`status` text DEFAULT 'running' NOT NULL,
	`scan_kind` text DEFAULT 'live_readiness' NOT NULL,
	`methodology_version` text NOT NULL,
	`language` text NOT NULL,
	`country` text NOT NULL,
	`readiness_score` integer,
	`actual_visibility_status` text DEFAULT 'not_measured' NOT NULL,
	`confidence` integer,
	`issue_count` integer DEFAULT 0 NOT NULL,
	`critical_count` integer DEFAULT 0 NOT NULL,
	`source_url` text NOT NULL,
	`final_url` text,
	`http_status` integer,
	`cache_key` text NOT NULL,
	`bytes_fetched` integer DEFAULT 0 NOT NULL,
	`request_count` integer DEFAULT 0 NOT NULL,
	`error_message` text,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requested_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_scans_organization_created` ON `scans` (`organization_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_scans_site_created` ON `scans` (`site_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_scans_cache_status_created` ON `scans` (`cache_key`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`host` text NOT NULL,
	`normalized_url` text NOT NULL,
	`display_name` text NOT NULL,
	`default_language` text DEFAULT 'English' NOT NULL,
	`default_country` text DEFAULT 'United States' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sites_organization_host` ON `sites` (`organization_id`,`host`);--> statement-breakpoint
CREATE INDEX `idx_sites_organization_updated` ON `sites` (`organization_id`,`updated_at`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`plan` text NOT NULL,
	`status` text DEFAULT 'inactive' NOT NULL,
	`provider` text,
	`provider_customer_id` text,
	`provider_subscription_id` text,
	`current_period_end` text,
	`cancel_at_period_end` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_subscriptions_organization_status` ON `subscriptions` (`organization_id`,`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_subscriptions_provider_id` ON `subscriptions` (`provider`,`provider_subscription_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

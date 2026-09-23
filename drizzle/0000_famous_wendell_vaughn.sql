CREATE TABLE `support_tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`access_key_hash` text NOT NULL,
	`requester_name` text NOT NULL,
	`requester_email` text NOT NULL,
	`authenticated_user_id` text,
	`question` text NOT NULL,
	`page_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`human_reply` text,
	`answered_by` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`answered_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_support_tickets_public_id` ON `support_tickets` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_support_tickets_status_created` ON `support_tickets` (`status`,`created_at`);
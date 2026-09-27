CREATE TABLE `sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_expires` ON `sessions` (`expires_at`);--> statement-breakpoint
ALTER TABLE `users` ADD `auth_provider` text DEFAULT 'chatgpt' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `provider_subject` text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE `users` SET `provider_subject` = `id` WHERE `provider_subject` = '';--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_provider_subject` ON `users` (`auth_provider`,`provider_subject`);

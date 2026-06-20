ALTER TABLE `orders` ADD COLUMN `subtotal` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `shipping_cost` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `discount` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `coupon_code` text DEFAULT '';--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);

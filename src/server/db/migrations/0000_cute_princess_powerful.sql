CREATE TABLE `suji_accounts` (
	`internal_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`initial` char(1) NOT NULL,
	`user_external_id` varchar(255),
	`public_id` char(16) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`categories` json DEFAULT ('[]'),
	`amount` double NOT NULL DEFAULT 0,
	CONSTRAINT `suji_accounts_internal_id` PRIMARY KEY(`internal_id`),
	CONSTRAINT `name_idx` UNIQUE(`name`,`user_external_id`),
	CONSTRAINT `unique_public_id` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `suji_transactions` (
	`internal_id` int AUTO_INCREMENT NOT NULL,
	`summary` varchar(50) NOT NULL,
	`details` text,
	`public_id` char(16) NOT NULL,
	`user_external_id` varchar(255),
	`account_internal_id` int,
	`date` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`type` enum('income','expense','transfer') NOT NULL,
	`category` varchar(50),
	`amount` double NOT NULL DEFAULT 0,
	CONSTRAINT `suji_transactions_internal_id` PRIMARY KEY(`internal_id`),
	CONSTRAINT `unique_public_id` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `suji_users` (
	`internal_id` int AUTO_INCREMENT NOT NULL,
	`external_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suji_users_internal_id` PRIMARY KEY(`internal_id`),
	CONSTRAINT `external_id_idx` UNIQUE(`external_id`)
);
--> statement-breakpoint
CREATE INDEX `summary_idx` ON `suji_transactions` (`summary`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `suji_transactions` (`type`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `suji_transactions` (`category`);
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text(30) NOT NULL,
	`description` text(200),
	`type` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`isArchived` integer NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "balance" CHECK("__new_accounts"."balance" >= 0.00 AND "__new_accounts"."balance" <= 999999999999.99)
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "userId", "name", "description", "type", "balance", "isArchived", "createdAt", "updatedAt") SELECT "id", "userId", "name", "description", "type", "balance", "isArchived", "createdAt", "updatedAt" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`accountId` text NOT NULL,
	`categoryId` text,
	`targetAccountId` text,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`comment` text(200),
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`targetAccountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "amount" CHECK("__new_transactions"."amount" >= 0.01 AND "__new_transactions"."amount" <= 999999999999.99)
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "userId", "accountId", "categoryId", "targetAccountId", "type", "amount", "comment", "createdAt", "updatedAt") SELECT "id", "userId", "accountId", "categoryId", "targetAccountId", "type", "amount", "comment", "createdAt", "updatedAt" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;
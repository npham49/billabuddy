-- Your SQL goes here
CREATE TABLE `users`(
	`id` INTEGER NOT NULL PRIMARY KEY,
	`email` TEXT NOT NULL,
	`name` TEXT NOT NULL,
	`created_at` TIMESTAMP NOT NULL,
	`updated_at` TIMESTAMP NOT NULL
);

CREATE TABLE `time_entries`(
	`id` INTEGER NOT NULL PRIMARY KEY,
	`user_id` INTEGER NOT NULL,
	`task_name` TEXT NOT NULL,
	`note` TEXT,
	`start_time` TIMESTAMP NOT NULL,
	`end_time` TIMESTAMP NOT NULL,
	`created_at` TIMESTAMP NOT NULL,
	`updated_at` TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);


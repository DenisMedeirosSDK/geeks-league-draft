CREATE TABLE `draft_order` (
	`id` text PRIMARY KEY,
	`league_id` text NOT NULL,
	`team_id` text NOT NULL,
	`position` integer NOT NULL,
	CONSTRAINT `fk_draft_order_league_id_leagues_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_draft_order_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `draft_state` (
	`id` text PRIMARY KEY,
	`league_id` text NOT NULL UNIQUE,
	`pick_id_counter` integer DEFAULT 0 NOT NULL,
	`draft_pointer` integer DEFAULT 0 NOT NULL,
	`current_step` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_draft_state_league_id_leagues_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `leagues` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`teams_count` integer NOT NULL,
	`players_per_team` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY,
	`league_id` text NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_players_league_id_leagues_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `team_players` (
	`team_id` text NOT NULL,
	`player_id` text NOT NULL,
	`pick_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `team_players_pk` PRIMARY KEY(`team_id`, `player_id`),
	CONSTRAINT `fk_team_players_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_team_players_player_id_players_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY,
	`league_id` text NOT NULL,
	`name` text NOT NULL,
	`draft_position` integer NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_teams_league_id_leagues_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON DELETE CASCADE
);

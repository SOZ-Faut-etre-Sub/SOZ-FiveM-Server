ALTER TABLE `race_score` DROP COLUMN `time`;
ALTER TABLE `race_score` ADD COLUMN `best_run` TEXT NOT NULL;
ALTER TABLE `race_score` ADD COLUMN `best_splits` TEXT NOT NULL;

ALTER TABLE `race` ADD COLUMN `fps` BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS `race` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `model` VARCHAR(50) NOT NULL,
    `npc_position` TEXT NOT NULL,
    `start` TEXT NOT NULL,
    `checkpoints` TEXT NOT NULL,
	`enabled` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE IF NOT EXISTS `race_score` (
    `citizenid` VARCHAR(50) NOT NULL,
    `race_id` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,

    PRIMARY KEY (`citizenid`, `race_id`),
    FOREIGN KEY (`race_id`) REFERENCES `race`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`citizenid`) REFERENCES `player`(`citizenid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE UTF8MB4_UNICODE_CI;

-- AddForeignKey
ALTER TABLE `race_score` ADD CONSTRAINT `FK_race_scores_player` FOREIGN KEY (`citizenid`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `race_score` ADD CONSTRAINT `FK_race_id` FOREIGN KEY (`race_id`) REFERENCES `race`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

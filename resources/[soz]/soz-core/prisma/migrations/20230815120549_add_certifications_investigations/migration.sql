-- DropForeignKey
ALTER TABLE `race_score` DROP FOREIGN KEY `race_score_ibfk_1`;

-- DropForeignKey
ALTER TABLE `race_score` DROP FOREIGN KEY `race_score_ibfk_2`;

-- AlterTable
ALTER TABLE `investigation` ADD COLUMN `granted_certifications` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `vehicles` MODIFY `maxStock` INTEGER NULL DEFAULT 2;

-- CreateIndex
CREATE INDEX `name` ON `race`(`name`);

-- AddForeignKey
ALTER TABLE `race_score` ADD CONSTRAINT `FK_race_scores_player` FOREIGN KEY (`citizenid`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `race_score` ADD CONSTRAINT `FK_race_id` FOREIGN KEY (`race_id`) REFERENCES `race`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `investigation` MODIFY `type` ENUM('appeal', 'investigation', 'report', 'common_report', 'operation', 'certification', 'sentence', 'criminal_record', 'complaint', 'document') NOT NULL DEFAULT 'investigation';

-- AlterTable
ALTER TABLE `investigation` ADD COLUMN `isFavorite` BOOLEAN NULL DEFAULT false;

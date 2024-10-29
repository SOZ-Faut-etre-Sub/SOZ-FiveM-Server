-- AlterTable
ALTER TABLE `investigation` MODIFY `type` ENUM('investigation', 'report', 'complaint', 'appeal', 'document') NOT NULL DEFAULT 'investigation';

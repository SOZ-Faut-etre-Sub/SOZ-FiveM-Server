-- AlterTable
ALTER TABLE `investigation` ADD COLUMN `isTemplate` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `type` ENUM('investigation', 'report', 'complaint') NOT NULL DEFAULT 'investigation';

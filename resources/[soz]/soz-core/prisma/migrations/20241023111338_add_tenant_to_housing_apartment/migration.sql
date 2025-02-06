-- AlterTable
ALTER TABLE `housing_apartment` ADD COLUMN `tenant` VARCHAR(191) NULL DEFAULT (`owner`);

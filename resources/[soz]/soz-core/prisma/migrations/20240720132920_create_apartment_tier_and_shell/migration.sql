-- AlterTable
ALTER TABLE `housing_apartment` ADD COLUMN `cloth_tier` INTEGER NULL DEFAULT (`tier`),
    ADD COLUMN `money_tier` INTEGER NULL DEFAULT (`tier`),
    ADD COLUMN `park_tier` INTEGER NULL DEFAULT (`tier`),
    ADD COLUMN `shell` BOOLEAN NOT NULL DEFAULT true;

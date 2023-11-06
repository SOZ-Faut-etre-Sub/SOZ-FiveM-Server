/*
  Warnings:

  - Made the column `owner` on table `billboard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `billboard` MODIFY `owner` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `fdf_crops` (
    `id` VARCHAR(191) NOT NULL,
    `field` VARCHAR(50) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `coords` VARCHAR(100) NOT NULL,
    `hilled` BOOLEAN NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

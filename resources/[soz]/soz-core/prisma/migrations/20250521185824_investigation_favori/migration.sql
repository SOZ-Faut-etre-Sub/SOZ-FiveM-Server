/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `investigation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `investigation` DROP COLUMN `isFavorite`;

-- CreateTable
CREATE TABLE `investigation_favori` (
    `citizenid` VARCHAR(255) NOT NULL,
    `investigationId` INTEGER NOT NULL,

    PRIMARY KEY (`citizenid`, `investigationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `investigation_favori` ADD CONSTRAINT `investigation_favori_investigationId_fkey` FOREIGN KEY (`investigationId`) REFERENCES `investigation`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

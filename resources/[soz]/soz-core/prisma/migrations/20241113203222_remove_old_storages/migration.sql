/*
  Warnings:

  - You are about to drop the column `inventory` on the `player` table. All the data in the column will be lost.
  - You are about to drop the `storages` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `player` DROP COLUMN `inventory`;

-- DropTable
DROP TABLE `storages`;

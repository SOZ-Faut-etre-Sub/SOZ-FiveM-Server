/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `upw_facility` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `upw_facility` ADD COLUMN `config` LONGTEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `upw_facility_identifier_key` ON `upw_facility`(`identifier`);

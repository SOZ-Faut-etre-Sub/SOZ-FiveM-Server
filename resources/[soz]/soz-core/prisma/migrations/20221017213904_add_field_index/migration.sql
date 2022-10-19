/*
  Warnings:

  - A unique constraint covering the columns `[identifier,owner]` on the table `field` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `field_identifier_owner_key` ON `field`(`identifier`, `owner`);

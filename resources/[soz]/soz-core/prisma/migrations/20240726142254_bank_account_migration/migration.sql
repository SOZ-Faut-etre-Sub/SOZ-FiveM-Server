/*
  Warnings:

  - A unique constraint covering the columns `[businessid]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[houseid]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gangid]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `businessid` ON `bank_accounts`;

-- DropIndex
DROP INDEX `gangid` ON `bank_accounts`;

-- CreateIndex
CREATE UNIQUE INDEX `businessid` ON `bank_accounts`(`businessid`);

-- CreateIndex
CREATE UNIQUE INDEX `houseid` ON `bank_accounts`(`houseid`);

-- CreateIndex
CREATE UNIQUE INDEX `gangid` ON `bank_accounts`(`gangid`);

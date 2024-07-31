/*
  Warnings:

  - You are about to drop the column `account` on the `bank_statements` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `bank_statements` table. All the data in the column will be lost.
  - You are about to drop the column `businessid` on the `bank_statements` table. All the data in the column will be lost.
  - You are about to drop the column `citizenid` on the `bank_statements` table. All the data in the column will be lost.
  - You are about to drop the column `deposited` on the `bank_statements` table. All the data in the column will be lost.
  - You are about to drop the column `gangid` on the `bank_statements` table. All the data in the column will be lost.
  - You are about to drop the column `withdraw` on the `bank_statements` table. All the data in the column will be lost.
  - Made the column `accountid` on table `bank_accounts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `amount` to the `bank_statements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_accountid` to the `bank_statements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_accountid` to the `bank_statements` table without a default value. This is not possible if the table is not empty.
  - Made the column `date` on table `bank_statements` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `businessid` ON `bank_statements`;

-- DropIndex
DROP INDEX `gangid` ON `bank_statements`;

-- AlterTable
ALTER TABLE `bank_accounts` MODIFY `accountid` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `bank_statements` DROP COLUMN `account`,
    DROP COLUMN `balance`,
    DROP COLUMN `businessid`,
    DROP COLUMN `citizenid`,
    DROP COLUMN `deposited`,
    DROP COLUMN `gangid`,
    DROP COLUMN `withdraw`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `source_accountid` VARCHAR(50) NOT NULL,
    ADD COLUMN `target_accountid` VARCHAR(50) NOT NULL,
    MODIFY `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `reason` TEXT NULL;

-- CreateIndex
CREATE INDEX `source_accountid` ON `bank_statements`(`source_accountid`);

-- CreateIndex
CREATE INDEX `target_accountid` ON `bank_statements`(`target_accountid`);

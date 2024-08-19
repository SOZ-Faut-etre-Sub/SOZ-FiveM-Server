-- DropIndex
DROP INDEX `businessid` ON `bank_statements`;

-- DropIndex
DROP INDEX `gangid` ON `bank_statements`;

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

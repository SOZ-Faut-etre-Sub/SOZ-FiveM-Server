-- AlterTable
ALTER TABLE `gang` MODIFY `metadata` MEDIUMTEXT NOT NULL;

-- AlterTable
ALTER TABLE `loot_item` ADD COLUMN `min` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `player` ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT 0;
ALTER TABLE `player`ALTER COLUMN `created_at` SET DEFAULT CURRENT_TIMESTAMP(0);

-- CreateIndex
CREATE INDEX `created_at` ON `player`(`created_at`);

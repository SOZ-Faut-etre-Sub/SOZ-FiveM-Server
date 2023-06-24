-- AlterTable
ALTER TABLE `player_vehicles` MODIFY `pound_price` INTEGER NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `storageTypeOwner` ON `storages`(`name`, `type`, `owner`);

-- CreateIndex
CREATE INDEX `identifier` ON `upw_facility`(`identifier`);

-- AlterTable
ALTER TABLE `drugs_seedling` MODIFY `drug` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `player_fish` (
    `citizenId` VARCHAR(50) NOT NULL,
    `fishId` VARCHAR(100) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `maxWidth` INTEGER NOT NULL,
    `maxWeight` INTEGER NOT NULL,
    `lastFishAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`citizenId`, `fishId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `player_fish` ADD CONSTRAINT `FK_fish_player` FOREIGN KEY (`citizenId`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `drugs_garden_guest_citizenid_guest_key` ON `drugs_garden_guest`(`citizenid`, `guest`);
DROP INDEX `citizenid` ON `drugs_garden_guest`;

-- RedefineIndex
CREATE UNIQUE INDEX `drugs_sell_location_name_type_key` ON `drugs_sell_location`(`name`, `type`);
DROP INDEX `name` ON `drugs_sell_location`;

-- CreateTable
CREATE TABLE `player_sozedex_rewards` (
    `citizenId` VARCHAR(50) NOT NULL,
    `itemId` VARCHAR(100) NOT NULL,
    `claimedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`citizenId`, `itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
    ALTER TABLE `player_sozedex_rewards` ADD CONSTRAINT `FK_player_sozedex_rewards` FOREIGN KEY (`citizenId`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;
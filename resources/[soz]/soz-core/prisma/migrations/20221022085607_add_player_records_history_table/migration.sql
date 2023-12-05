-- CreateTable
CREATE TABLE `player_records_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(255) NOT NULL,
    `author_citizenid` VARCHAR(255) NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `content` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `playerrecordshistory_id_uindex`(`id`),
    INDEX `citizenid`(`citizenid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `player_records_history` ADD CONSTRAINT `FK_playerrecordshistory_target` FOREIGN KEY (`citizenid`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_records_history` ADD CONSTRAINT `FK_playerrecordshistory_author` FOREIGN KEY (`author_citizenid`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

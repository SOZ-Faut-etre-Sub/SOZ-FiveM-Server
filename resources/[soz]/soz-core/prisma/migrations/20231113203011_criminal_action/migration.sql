-- CreateTable
CREATE TABLE `criminal_action` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NOT NULL,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `type` VARCHAR(50) NOT NULL,
    `data` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `criminal_action` ADD CONSTRAINT `FK_criminal_actions_player` FOREIGN KEY (`citizenid`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `bank_contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NOT NULL,
    `label` VARCHAR(50) NOT NULL,
    `accountid` VARCHAR(50) NOT NULL,

    INDEX `citizenid`(`citizenid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

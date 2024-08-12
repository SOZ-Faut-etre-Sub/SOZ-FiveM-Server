-- CreateTable
CREATE TABLE `darkweb_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(512) NOT NULL,
    `user_identifier` VARCHAR(48) NOT NULL,
    `conversation_id` INTEGER NOT NULL,
    `phoneNumber` VARCHAR(128) NOT NULL,
    `isRead` TINYINT NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_identifier`(`user_identifier`),
    INDEX `conversation_id`(`conversation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `darkweb_conversations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `password` VARCHAR(128) NOT NULL,
    `user_identifier` VARCHAR(8) NOT NULL,
    `label` VARCHAR(60) NULL DEFAULT '',
    `unread` INTEGER NOT NULL DEFAULT 0,
    `masked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_identifier`(`user_identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `darkweb_participants` (
    `conversation_id` INTEGER NOT NULL,
    `user_identifier` VARCHAR(8) NOT NULL,
    `masked` BOOLEAN NOT NULL DEFAULT false,
    `phoneNumber` VARCHAR(128) NOT NULL,
    `unread` BOOLEAN NOT NULL DEFAULT true,
    `notification` BOOLEAN NOT NULL DEFAULT false,
    `joinedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `role` VARCHAR(128) NOT NULL,

    INDEX `user_identifier`(`user_identifier`),
    INDEX `conversation_id`(`conversation_id`),
    PRIMARY KEY (`user_identifier`, `conversation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

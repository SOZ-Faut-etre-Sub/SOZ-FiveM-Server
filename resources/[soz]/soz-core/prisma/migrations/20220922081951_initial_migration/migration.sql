-- CreateTable
CREATE TABLE `bank_accounts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `accountid` VARCHAR(50) NULL,
    `citizenid` VARCHAR(50) NULL,
    `businessid` VARCHAR(50) NULL,
    `houseid` VARCHAR(50) NULL,
    `gangid` VARCHAR(50) NULL,
    `money` BIGINT NOT NULL DEFAULT 0,
    `marked_money` BIGINT NOT NULL DEFAULT 0,
    `account_type` ENUM('player', 'business', 'safestorages', 'offshore', 'bank-atm') NOT NULL DEFAULT 'player',
    `coords` TEXT NULL,

    UNIQUE INDEX `accountid`(`accountid`),
    UNIQUE INDEX `citizenid`(`citizenid`),
    INDEX `businessid`(`businessid`),
    INDEX `gangid`(`gangid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_statements` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NULL,
    `account` VARCHAR(50) NULL,
    `businessid` VARCHAR(50) NULL,
    `gangid` VARCHAR(50) NULL,
    `deposited` INTEGER NULL,
    `withdraw` INTEGER NULL,
    `balance` INTEGER NULL,
    `date` VARCHAR(50) NULL,
    `reason` VARCHAR(255) NULL,

    INDEX `businessid`(`businessid`),
    INDEX `gangid`(`gangid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,
    `license` VARCHAR(50) NULL,
    `discord` VARCHAR(50) NULL,
    `ip` VARCHAR(50) NULL,
    `reason` TEXT NULL,
    `expire` INTEGER NULL,
    `bannedby` VARCHAR(255) NOT NULL DEFAULT 'LeBanhammer',

    INDEX `discord`(`discord`),
    INDEX `ip`(`ip`),
    INDEX `license`(`license`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concess_entreprise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job` VARCHAR(15) NOT NULL,
    `vehicle` VARCHAR(15) NOT NULL,
    `price` INTEGER NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'car',
    `liverytype` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concess_storage` (
    `model` VARCHAR(50) NOT NULL,
    `stock` INTEGER NOT NULL,
    `category` VARCHAR(60) NULL,

    PRIMARY KEY (`model`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fuel_storage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `station` VARCHAR(15) NOT NULL,
    `fuel` VARCHAR(15) NOT NULL,
    `type` VARCHAR(20) NOT NULL DEFAULT 'public',
    `owner` VARCHAR(32) NULL,
    `stock` INTEGER NOT NULL,
    `price` FLOAT NULL DEFAULT 0.00,
    `position` TEXT NOT NULL,
    `model` INTEGER NOT NULL,
    `zone` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `housing_apartment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `identifier` VARCHAR(50) NULL,
    `label` VARCHAR(50) NULL,
    `price` INTEGER NULL,
    `owner` VARCHAR(50) NULL,
    `roommate` VARCHAR(50) NULL,
    `inside_coord` LONGTEXT NULL,
    `exit_zone` LONGTEXT NULL,
    `fridge_zone` LONGTEXT NULL,
    `stash_zone` LONGTEXT NULL,
    `closet_zone` LONGTEXT NULL,
    `money_zone` LONGTEXT NULL,

    INDEX `housing_apartment_housing_property_id_fk`(`property_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `housing_property` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(32) NOT NULL,
    `entry_zone` LONGTEXT NULL,
    `garage_zone` LONGTEXT NULL,
    `exterior_culling` LONGTEXT NOT NULL DEFAULT '[]',

    UNIQUE INDEX `housing_property_identifier_uindex`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NOT NULL,
    `emitter` VARCHAR(50) NOT NULL,
    `emitterName` VARCHAR(50) NOT NULL,
    `emitterSafe` VARCHAR(50) NOT NULL,
    `targetAccount` VARCHAR(20) NULL,
    `label` VARCHAR(200) NOT NULL,
    `amount` INTEGER NOT NULL,
    `payed` BOOLEAN NOT NULL DEFAULT false,
    `kind` VARCHAR(50) NULL DEFAULT 'invoice',
    `refused` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `citizenid`(`citizenid`),
    INDEX `emitter`(`emitter`),
    INDEX `payed`(`payed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_grades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobId` VARCHAR(50) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `weight` INTEGER NOT NULL DEFAULT 0,
    `salary` INTEGER NULL DEFAULT 0,
    `owner` INTEGER NULL DEFAULT 0,
    `is_default` INTEGER NULL DEFAULT 0,
    `permissions` TEXT NULL,

    INDEX `jobId`(`jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



-- CreateTable
CREATE TABLE `persistent_prop` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `model` INTEGER NOT NULL,
    `event` VARCHAR(20) NULL,
    `position` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_calls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(48) NULL,
    `transmitter` VARCHAR(8) NOT NULL,
    `receiver` VARCHAR(8) NOT NULL,
    `is_accepted` TINYINT NULL DEFAULT 0,
    `start` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `end` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    INDEX `identifier`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(48) NULL,
    `number` VARCHAR(8) NULL,
    `display` VARCHAR(255) NOT NULL DEFAULT '',

    INDEX `identifier`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(48) NULL,
    `image` VARCHAR(255) NOT NULL,

    INDEX `identifier`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(512) NOT NULL,
    `user_identifier` VARCHAR(48) NOT NULL,
    `conversation_id` VARCHAR(128) NOT NULL,
    `isRead` TINYINT NOT NULL DEFAULT 0,
    `visible` TINYINT NOT NULL DEFAULT 1,
    `author` VARCHAR(8) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_identifier`(`user_identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_messages_conversations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_identifier` VARCHAR(8) NOT NULL,
    `conversation_id` VARCHAR(128) NOT NULL,
    `participant_identifier` VARCHAR(8) NOT NULL,
    `label` VARCHAR(60) NULL DEFAULT '',
    `unreadCount` INTEGER NOT NULL DEFAULT 0,
    `unread` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_identifier`(`user_identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(48) NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `content` VARCHAR(1024) NOT NULL,

    INDEX `identifier`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_profile` (
    `number` VARCHAR(8) NOT NULL,
    `avatar` VARCHAR(255) NULL,

    PRIMARY KEY (`number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_society_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversation_id` VARCHAR(512) NOT NULL,
    `source_phone` VARCHAR(10) NOT NULL,
    `message` VARCHAR(512) NOT NULL,
    `position` LONGTEXT NULL,
    `isTaken` TINYINT NOT NULL DEFAULT 0,
    `takenBy` VARCHAR(70) NULL,
    `takenByUsername` VARCHAR(70) NULL,
    `isDone` TINYINT NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `conversation_id`(`conversation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phone_twitch_news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(512) NOT NULL,
    `reporter` VARCHAR(150) NULL,
    `reporterId` VARCHAR(70) NULL,
    `image` VARCHAR(256) NULL,
    `message` VARCHAR(512) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NOT NULL,
    `cid` INTEGER NULL,
    `license` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `money` TEXT NOT NULL,
    `charinfo` TEXT NULL,
    `job` TEXT NOT NULL,
    `gang` TEXT NULL,
    `position` TEXT NOT NULL,
    `metadata` TEXT NOT NULL,
    `inventory` LONGTEXT NULL,
    `last_updated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_default` INTEGER NOT NULL DEFAULT 0,
    `skin` TEXT NULL,
    `cloth_config` TEXT NULL,
    `features` TEXT NULL DEFAULT '[]',

    INDEX `id`(`id`),
    INDEX `last_updated`(`last_updated`),
    INDEX `license`(`license`),
    PRIMARY KEY (`citizenid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_cloth_set` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `cloth_set` TEXT NOT NULL,

    INDEX `FK_player_cloth_set_player`(`citizenid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_outfits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NULL,
    `outfitname` VARCHAR(50) NOT NULL,
    `model` VARCHAR(50) NULL,
    `skin` TEXT NULL,
    `outfitId` VARCHAR(50) NOT NULL,

    INDEX `citizenid`(`citizenid`),
    INDEX `outfitId`(`outfitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_vehicles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `license` VARCHAR(50) NULL,
    `citizenid` VARCHAR(50) NULL,
    `vehicle` VARCHAR(50) NULL,
    `hash` VARCHAR(50) NULL,
    `mods` LONGTEXT NULL,
    `condition` LONGTEXT NULL,
    `plate` VARCHAR(15) NOT NULL,
    `fakeplate` VARCHAR(50) NULL,
    `garage` VARCHAR(50) NULL,
    `job` VARCHAR(15) NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'car',
    `fuel` INTEGER NULL DEFAULT 100,
    `engine` FLOAT NULL DEFAULT 1000,
    `body` FLOAT NULL DEFAULT 1000,
    `state` INTEGER NULL DEFAULT 1,
    `life_counter` INTEGER NOT NULL DEFAULT 3,
    `drivingdistance` INTEGER NULL,
    `status` TEXT NULL,
    `boughttime` INTEGER NOT NULL DEFAULT 0,
    `parkingtime` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `UK_playervehicles_plate`(`plate`),
    INDEX `citizenid`(`citizenid`),
    INDEX `license`(`license`),
    INDEX `plate`(`plate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `storages` (
    `name` VARCHAR(50) NOT NULL,
    `type` VARCHAR(50) NULL,
    `owner` VARCHAR(64) NULL,
    `max_slots` INTEGER NULL DEFAULT 10,
    `max_weight` INTEGER NULL DEFAULT 250000,
    `inventory` LONGTEXT NULL,

    INDEX `owner`(`owner`),
    INDEX `type`(`type`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `upw_facility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,
    `identifier` VARCHAR(50) NOT NULL,
    `data` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicles` (
    `model` VARCHAR(50) NOT NULL,
    `hash` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` INTEGER NOT NULL,
    `category` VARCHAR(50) NULL,
    `dealership_id` VARCHAR(10) NULL,
    `required_licence` VARCHAR(10) NULL,
    `size` INTEGER NULL DEFAULT 1,
    `job_name` TEXT NULL,

    INDEX `vehicles_category_idx`(`category`),
    INDEX `vehicles_dealership_idx`(`dealership_id`),
    PRIMARY KEY (`model`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_purchases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NOT NULL,
    `shop_type` VARCHAR(25) NOT NULL,
    `shop_id` VARCHAR(50) NULL,
    `item_id` VARCHAR(50) NOT NULL,
    `amount` INTEGER NOT NULL,
    `date` INTEGER NOT NULL,

    INDEX `shop_id`(`shop_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER NULL,

    INDEX `parent_id`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `field` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(64) NOT NULL,
    `owner` VARCHAR(32) NULL,
    `data` LONGTEXT NULL,

    UNIQUE INDEX `identifier`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investigation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(255) NOT NULL,
    `service` VARCHAR(255) NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `closed` BOOLEAN NULL DEFAULT false,
    `granted` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `investigation_id_uindex`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investigation_revision` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `investigationId` INTEGER NULL,
    `citizenid` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_investigation`(`investigationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `label` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `category_id`(`category_id`),
    INDEX `shop_id`(`shop_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `label` VARCHAR(255) NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 50,
    `data` LONGTEXT NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 5,

    INDEX `category_id`(`category_id`),
    INDEX `shop_id`(`shop_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `housing_apartment` ADD CONSTRAINT `housing_apartment_housing_property_id_fk` FOREIGN KEY (`property_id`) REFERENCES `housing_property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey

-- AddForeignKey
ALTER TABLE `player_vehicles` ADD CONSTRAINT `FK_playervehicles_players` FOREIGN KEY (`citizenid`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `investigation_revision` ADD CONSTRAINT `fk_investigation` FOREIGN KEY (`investigationId`) REFERENCES `investigation`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `shop_categories` ADD CONSTRAINT `shop_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `shop_categories` ADD CONSTRAINT `shop_categories_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `shop_content` ADD CONSTRAINT `shop_content_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `shop_content` ADD CONSTRAINT `shop_content_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

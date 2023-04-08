-- CreateTable
CREATE TABLE `upw_stations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `station` VARCHAR(15) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `max_stock` INTEGER NOT NULL DEFAULT 600,
    `price` FLOAT NULL DEFAULT 0.00,
    `position` TEXT NOT NULL,

    UNIQUE INDEX `upw_stations_station_key`(`station`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `upw_chargers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `station` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `active` INTEGER NOT NULL DEFAULT 0,

    INDEX `FK_upw_chargers_soz_test.upw_stations`(`station`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `upw_chargers` ADD CONSTRAINT `FK_upw_chargers_soz_test.upw_stations` FOREIGN KEY (`station`) REFERENCES `upw_stations`(`station`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- CreateTable
CREATE TABLE `apartment_fourniture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apartment_id` INTEGER NOT NULL,
    `model` VARCHAR(120) NOT NULL,
    `position` LONGTEXT NULL,
    `matrix` LONGTEXT NULL,
    `storage_type` VARCHAR(120) NULL,

    INDEX `apartment_id`(`apartment_id`),
    INDEX `housing_apartment_housing_apartment_id_fk`(`apartment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `apartment_fourniture` ADD CONSTRAINT `housing_apartment_housing_apartment_id_fk` FOREIGN KEY (`apartment_id`) REFERENCES `housing_apartment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

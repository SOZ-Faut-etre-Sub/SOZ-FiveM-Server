-- Wrong migration which was editable after a first deploy on beta. Another migration will drop the table and recreate it correctly
CREATE TABLE `apartment_fourniture` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `apartment_id` BIGINT NOT NULL,
    `model` VARCHAR(120) NOT NULL,
    `position` LONGTEXT NULL,
    `matrix` LONGTEXT NULL,
    `storage_type` VARCHAR(120) NULL,
  
    INDEX `apartment_id`(`apartment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
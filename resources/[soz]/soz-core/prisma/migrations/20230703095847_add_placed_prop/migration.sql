-- CreateTable
CREATE TABLE `placed_prop` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `unique_id` VARCHAR(255) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `collection` VARCHAR(50) NULL,
    `position` LONGTEXT NOT NULL,
    `matrix` LONGTEXT NULL,

    UNIQUE INDEX `placed_prop_unique_id_key`(`unique_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

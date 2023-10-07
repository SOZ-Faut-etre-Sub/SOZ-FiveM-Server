-- CreateTable
CREATE TABLE `collection_prop` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `creator` VARCHAR(50) NOT NULL,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `collection_prop_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `placed_prop` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `unique_id` VARCHAR(255) NOT NULL,
    `collection` VARCHAR(50) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `position` LONGTEXT NOT NULL,
    `matrix` LONGTEXT NULL,
    `collision` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `placed_prop_unique_id_key`(`unique_id`),
    INDEX `FK_placed_prop_soz_collection_prop`(`collection`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `placed_prop` ADD CONSTRAINT `FK_placed_prop_soz_collection_prop` FOREIGN KEY (`collection`) REFERENCES `collection_prop`(`name`) ON DELETE CASCADE ON UPDATE RESTRICT;

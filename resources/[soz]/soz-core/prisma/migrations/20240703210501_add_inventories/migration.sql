-- CreateTable
CREATE TABLE `inventories` (
    `id` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `configuration` JSON NOT NULL,
    `items` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

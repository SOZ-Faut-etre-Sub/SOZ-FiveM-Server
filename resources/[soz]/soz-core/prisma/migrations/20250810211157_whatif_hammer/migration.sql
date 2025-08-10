-- CreateTable
CREATE TABLE `whatif_props` (
    `id` VARCHAR(128) NOT NULL,
    `position` TEXT NOT NULL,
    `model` VARCHAR(50) NULL,
    `matrix` TEXT NULL,
    `noCollision` BOOLEAN NULL DEFAULT false,
    `citizenid` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle_order` (
    `id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `deliverDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

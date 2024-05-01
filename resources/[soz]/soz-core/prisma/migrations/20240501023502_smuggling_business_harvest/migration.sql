-- CreateTable
CREATE TABLE `smuggling_business_harvest_zone` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `data` TEXT NOT NULL,

    UNIQUE INDEX `smuggling_business_harvest_zone_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

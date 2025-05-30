-- CreateTable
CREATE TABLE `traveling` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `job` VARCHAR(15) NOT NULL,
    `points` TEXT NOT NULL,

    UNIQUE INDEX `traveling_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

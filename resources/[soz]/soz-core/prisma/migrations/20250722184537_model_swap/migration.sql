-- CreateTable
CREATE TABLE `model_swap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source` TEXT NOT NULL,
    `target` TEXT NULL,
    `position` TEXT NOT NULL,
    `range` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

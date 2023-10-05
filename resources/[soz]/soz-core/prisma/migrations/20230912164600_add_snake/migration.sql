-- CreateTable
CREATE TABLE `snake_score` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(50) NOT NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

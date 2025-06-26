-- CreateTable
CREATE TABLE `casino_statements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `luckywheel_car_model` VARCHAR(128) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

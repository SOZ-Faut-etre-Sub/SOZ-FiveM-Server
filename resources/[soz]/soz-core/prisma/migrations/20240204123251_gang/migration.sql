-- CreateTable
CREATE TABLE `gang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `hub` TEXT NOT NULL,
    `metadata` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `zone` MODIFY `type` ENUM('NoStress', 'VehBizSpawn', 'VehBizDelivery', 'VehBizResell') NOT NULL DEFAULT 'NoStress';

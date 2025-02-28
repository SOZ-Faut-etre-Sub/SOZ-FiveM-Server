-- CreateTable
CREATE TABLE `hc_props` (
    `id` VARCHAR(128) NOT NULL,
    `gangid` INTEGER NULL,
    `type` VARCHAR(50) NOT NULL,
    `position` TEXT NOT NULL,
    `model` VARCHAR(50) NULL,
    `matrix` TEXT NULL,
    `noCollision` BOOLEAN NULL DEFAULT false,
    `metadata` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hc_props` ADD CONSTRAINT `FK_gang_hc_props` FOREIGN KEY (`gangid`) REFERENCES `gang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

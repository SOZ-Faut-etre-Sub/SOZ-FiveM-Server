-- CreateTable
CREATE TABLE IF NOT EXISTS `billboard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `position` VARCHAR(50) NOT NULL,
    `originDictName` VARCHAR(50) NOT NULL,
    `originTextureName` VARCHAR(50) NOT NULL,
    `imageUrl` VARCHAR(200) NOT NULL,
    `previewImageUrl` VARCHAR(200) NOT NULL,
    `templateImageUrl` VARCHAR(200) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `lastEdit` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastEditor` VARCHAR(50) NOT NULL,
    `enabled` Boolean NOT NULL,

    PRIMARY KEY (`id`)
);

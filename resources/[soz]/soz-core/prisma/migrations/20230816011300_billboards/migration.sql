-- CreateTable
CREATE TABLE IF NOT EXISTS `billboard` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `position` VARCHAR(50) NOT NULL,
    `originDictName` VARCHAR(50) NOT NULL,
    `originTextureName` VARCHAR(50) NOT NULL,
    `imageUrl` VARCHAR(100) NOT NULL,
    `previewImageUrl` VARCHAR(100) NOT NULL,
    `templateImageUrl` VARCHAR(100) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `lastEdit` DATETIME NOT NULL,
    `lastEditor` INTEGER NOT NULL,
    `enabled` Boolean NOT NULL,

    PRIMARY KEY (`id`)
);

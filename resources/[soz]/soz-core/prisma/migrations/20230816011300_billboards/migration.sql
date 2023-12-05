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

INSERT INTO `billboard` (`id`, `name`, `position`, `originDictName`, `originTextureName`, `imageUrl`, `previewImageUrl`, `templateImageUrl`, `width`, `height`, `lastEdit`, `lastEditor`, `enabled`) VALUES
	(1, 'Triptyque Gauche', '[-2.19, -1012.34, 77.18]', 'soz_billboards_txd', 'triptyque_gauche', '', 'https://cdn.discordapp.com/attachments/877529170039672852/1148711826889129984/triptyque_gauche_template.webp', 'https://cdn.discordapp.com/attachments/877529170039672852/1148711826889129984/triptyque_gauche_template.webp', 412, 1024, '2023-08-16 01:22:34', '', 0),
	(2, 'Triptyque Droite', '[-2.19, -1012.34, 77.18]', 'soz_billboards_txd', 'triptyque_droite', '', 'https://cdn.discordapp.com/attachments/877529170039672852/1148711826410971176/triptyque_droite_template.webp', 'https://cdn.discordapp.com/attachments/877529170039672852/1148711826410971176/triptyque_droite_template.webp', 412, 1024, '2023-09-01 07:52:31', '', 0),
	(3, 'Triptyque Centre', '[-2.19, -1012.34, 77.18]', 'soz_billboards_txd', 'triptyque_centre', '', 'https://cdn.discordapp.com/attachments/877529170039672852/1148711827543445574/triptyque_centre_template.webp', 'https://cdn.discordapp.com/attachments/877529170039672852/1148711827543445574/triptyque_centre_template.webp', 342, 1024, '2023-08-16 01:22:34', '', 1);

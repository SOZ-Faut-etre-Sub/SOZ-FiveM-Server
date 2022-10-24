-- CreateTable
CREATE TABLE `police_fines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `price_min` INTEGER NOT NULL,
    `price_max` INTEGER NOT NULL,
    `category` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `policefines_id_uindex`(`id`),
    INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `police_fines` (`label`, `description`, `price_min`, `price_max`, `category`) VALUES
('Conduite sans permis',	'',	500,	500,	1),
('Dégradation de bien public',	'',	750,	750,	1),
('Insulte/outrage',	'',	100,	100,	1),
('Infraction au code de la route',	'',	100,	100,	1),
('Infraction au code de la route aggravé',	'',	200,	200,	1),
('Rappel à la loi',	'',	100,	100,	1),
('Rappel à la loi aggravé',	'',	250,	250,	1),
('Violation de propriété privée',	'',	2500,	2500,	1),
('Coups et blessures',	'',	2500,	10000,	2),
('Détention d\'objets prohibés',	'',	250,	250,	2),
('Détention d\'objets prohibés aggravée',	'',	1000,	1000,	2),
('Détention de matériel militaire',	'',	10000,	10000,	2),
('Détention de matériel militaire aggravée',	'',	15000,	15000, 2),
('Menace',	'',	1000,	10000,	2),
('Obstruction à la justice',	'',	1000,	1000,	2),
('Port d\'arme sans permis',	'',	10000,	10000,	2),
('Refus d\'obtempérer/délit de fuite',	'',	500,	500,	2),
('Vol/racket',	'',	500,	20000,	2),
('Agression à main armée',	'',	20000,	50000,	3),
('Enlèvement',	'',	20000,	50000,	3),
('Menace à main armée',	'',	10000,	30000,	3),
('Homicide involontaire',	'',	50000,	75000,	4),
('Prise d\'otage',	'',	30000,	50000,	4);
-- CreateTable
CREATE TABLE `investigation_category` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(255) NOT NULL,
  `service` VARCHAR(50) NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO investigation_category (label, service)
VALUES
    ('Enquêtes', 'police'),
    ('Transmissions', 'police'),
    ('Transmissions communes', 'police'),
    ('Opérations', 'police'),
    ('Formations / Certifications', 'police'),
    ('Peines en attente', 'police'),
    ('Investigations', 'police'),
    ('[archive] Plainte', 'police'),
    ('Recours', 'mdr'),
    ('Documents', 'taxi'),
    ('Documents', 'food'),
    ('Documents', 'news'),
    ('Documents', 'garbage'),
    ('Documents', 'oil'),
    ('Documents', 'cash-transfer'),
    ('Documents', 'bennys'),
    ('Documents', 'lsmc'),
    ('Documents', 'upw'),
    ('Documents', 'pawl'),
    ('Documents', 'baun'),
    ('Documents', 'ffs'),
    ('Documents', 'gouv'),
    ('Documents', 'fdf'),
    ('Documents', 'you-news'),
    ('Documents', 'dmc'),
    ('Documents', 'lscs'),
    ('Documents', NULL);

-- AlterTable
ALTER TABLE `investigation` ADD COLUMN `category_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `investigation_category_id_idx` ON `investigation`(`category_id`);

UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Enquêtes') WHERE type='investigation' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Transmissions') WHERE type='report' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Transmissions communes') WHERE type='common_report' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Opérations') WHERE type='operation' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Formations / Certifications') WHERE type='certification' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Peines en attente') WHERE type='sentence' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Investigations') WHERE type='criminal_record' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = '[archive] Plainte') WHERE type='complaint' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Recours') WHERE type='appeal' AND category_id = 0;
UPDATE investigation set category_id = (SELECT id FROM investigation_category WHERE label = 'Documents' and service=investigation.service) WHERE type='document' AND category_id = 0;

-- AlterTable
ALTER TABLE `investigation` DROP COLUMN `type`;

-- AddForeignKey
ALTER TABLE `investigation` ADD CONSTRAINT `investigation_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `investigation_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

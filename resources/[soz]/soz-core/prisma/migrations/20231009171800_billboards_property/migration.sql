-- AlterTable
ALTER TABLE `billboard` ADD COLUMN `owner` VARCHAR(50) NULL;

UPDATE `billboard` SET `owner` = 'news' WHERE originTextureName = 'triptyque_gauche';
UPDATE `billboard` SET `owner` = 'news' WHERE originTextureName = 'triptyque_centre';
UPDATE `billboard` SET `owner` = 'news' WHERE originTextureName = 'triptyque_droite';

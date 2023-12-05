-- DropForeignKey
ALTER TABLE `race_score` DROP FOREIGN KEY `race_score_ibfk_1`;

-- DropForeignKey
ALTER TABLE `race_score` DROP FOREIGN KEY `race_score_ibfk_2`;

-- AlterTable
ALTER TABLE `vandalism_props` MODIFY `location` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `vehicles` MODIFY `maxStock` INTEGER NULL DEFAULT 2;

-- CreateTable
CREATE TABLE `zone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('NoStress') NOT NULL DEFAULT 'NoStress',
    `zone` LONGTEXT NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `name` ON `race`(`name`);

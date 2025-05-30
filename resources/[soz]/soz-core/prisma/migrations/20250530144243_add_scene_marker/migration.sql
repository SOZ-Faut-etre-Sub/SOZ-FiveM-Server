-- AlterTable
ALTER TABLE `scene_entity` ADD COLUMN `user_id` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `scene_marker` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(255) NULL,
    `marker` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `scene_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `scene_marker` ADD CONSTRAINT `FK_scene_marker_scene` FOREIGN KEY (`scene_id`) REFERENCES `scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `_scene_associates` (
    `A` VARCHAR(50) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_scene_associates_AB_unique`(`A`, `B`),
    INDEX `_scene_associates_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_scene_associates` ADD CONSTRAINT `_scene_associates_A_fkey` FOREIGN KEY (`A`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_scene_associates` ADD CONSTRAINT `_scene_associates_B_fkey` FOREIGN KEY (`B`) REFERENCES `scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

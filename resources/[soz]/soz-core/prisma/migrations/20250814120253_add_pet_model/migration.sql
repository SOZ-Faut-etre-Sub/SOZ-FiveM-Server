-- CreateTable
CREATE TABLE `pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_id` VARCHAR(255) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `trait_up` VARCHAR(64) NOT NULL,
    `trait_down` VARCHAR(64) NOT NULL,
    `dead` BOOLEAN NOT NULL DEFAULT false,
    `hunger` FLOAT NOT NULL DEFAULT 100.00,
    `thirst` FLOAT NOT NULL DEFAULT 100.00,
    `energy` FLOAT NOT NULL DEFAULT 10.00,
    `affection` FLOAT NOT NULL DEFAULT 50.00,
    `training` FLOAT NOT NULL DEFAULT 5.00,
    `perDays` TEXT NOT NULL,
    `components` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `pet_owner_id_key`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pet` ADD CONSTRAINT `pet_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `player`(`citizenid`) ON DELETE RESTRICT ON UPDATE CASCADE;

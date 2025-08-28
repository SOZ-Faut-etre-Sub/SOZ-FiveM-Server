-- CreateTable
CREATE TABLE `job_pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job` VARCHAR(16) NOT NULL,
    `owner_id` VARCHAR(255) NULL,
    `model` VARCHAR(191) NOT NULL,
    `name` VARCHAR(32) NULL,
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

    UNIQUE INDEX `job_pet_owner_id_key`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `job_pet` ADD CONSTRAINT `job_pet_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `player`(`citizenid`) ON DELETE SET NULL ON UPDATE CASCADE;

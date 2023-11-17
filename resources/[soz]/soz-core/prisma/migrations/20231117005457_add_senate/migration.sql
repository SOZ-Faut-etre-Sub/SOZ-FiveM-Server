-- AlterTable
ALTER TABLE `housing_apartment` ADD COLUMN `senate_party_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `senate_party` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `senate_party_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `senate_party_member` (
    `id` VARCHAR(191) NOT NULL,
    `partyId` VARCHAR(191) NOT NULL,
    `citizenId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `senateSeatNumber` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `senate_party_member_id_idx`(`id`),
    INDEX `senate_party_member_partyId_idx`(`partyId`),
    INDEX `senate_party_member_citizenId_idx`(`citizenId`),
    UNIQUE INDEX `senate_party_member_senateSeatNumber_key`(`senateSeatNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `housing_apartment` ADD CONSTRAINT `housing_apartment_senate_id_fk` FOREIGN KEY (`senate_party_id`) REFERENCES `senate_party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senate_party_member` ADD CONSTRAINT `senate_party_member_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `senate_party`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senate_party_member` ADD CONSTRAINT `FK_senate_party_member_player` FOREIGN KEY (`citizenId`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

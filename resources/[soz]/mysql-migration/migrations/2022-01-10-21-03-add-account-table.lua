table.insert(
    migrations, {
        name = "add-account-table",
        queries = {
            [[
            CREATE TABLE `Account` (
                `id` BINARY(16) NOT NULL,
                `name` VARCHAR(191) NOT NULL,
                `lastName` VARCHAR(191) NOT NULL,
                `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                `updatedAt` DATETIME(3) NOT NULL,
                `whitelistStatus` ENUM('AWAITING', 'DENIED', 'ACCEPTED') NOT NULL,
                `whitelistReason` VARCHAR(191) NOT NULL,
                `whitelistStatusChangedById` BINARY(16) NULL,

                INDEX `Account_whitelistStatusChangedById_idx`(`whitelistStatusChangedById`),
                INDEX `Account_whitelistStatus_idx`(`whitelistStatus`),
                INDEX `Account_name_idx`(`name`),
                INDEX `Account_lastName_idx`(`lastName`),
                INDEX `Account_name_lastName_idx`(`name`, `lastName`),
                INDEX `Account_createdAt_idx`(`createdAt`),
                UNIQUE INDEX `Account_whitelistStatusChangedById_key`(`whitelistStatusChangedById`),
                PRIMARY KEY (`id`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        ]],
            [[
            CREATE TABLE `AccountIdentity` (
                `accountId` BINARY(16) NOT NULL,
                `identityType` ENUM('TWITCH', 'DISCORD', 'STEAM') NOT NULL,
                `identityId` VARCHAR(191) NOT NULL,
                `identityProperties` JSON NOT NULL,

                INDEX `AccountIdentity_identityType_identityId_idx`(`identityType`, `identityId`),
                PRIMARY KEY (`accountId`, `identityType`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        ]],
            [[
            CREATE TABLE `InvitationCode` (
                `id` BINARY(16) NOT NULL,
                `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                `updatedAt` DATETIME(3) NOT NULL,
                `validUntil` DATETIME(3) NULL,
                `createdById` BINARY(16) NULL,
                `acceptedById` BINARY(16) NULL,

                INDEX `InvitationCode_createdAt_idx`(`createdAt`),
                INDEX `InvitationCode_validUntil_idx`(`validUntil`),
                INDEX `InvitationCode_acceptedById_idx`(`acceptedById`),
                INDEX `InvitationCode_createdById_idx`(`createdById`),
                UNIQUE INDEX `InvitationCode_acceptedById_key`(`acceptedById`),
                PRIMARY KEY (`id`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        ]],
            [[
            ALTER TABLE `Account` ADD CONSTRAINT `Account_whitelistStatusChangedById_fkey` FOREIGN KEY (`whitelistStatusChangedById`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
        ]],
            [[
            ALTER TABLE `AccountIdentity` ADD CONSTRAINT `AccountIdentity_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
        ]],
            [[
            ALTER TABLE `InvitationCode` ADD CONSTRAINT `InvitationCode_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
        ]],
            [[
            ALTER TABLE `InvitationCode` ADD CONSTRAINT `InvitationCode_acceptedById_fkey` FOREIGN KEY (`acceptedById`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
        ]],
        },
    }
);

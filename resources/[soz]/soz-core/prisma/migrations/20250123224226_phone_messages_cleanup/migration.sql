-- CreateIndex
CREATE INDEX `createdAt` ON `phone_society_messages`(`createdAt`);

-- CreateIndex
CREATE INDEX `updatedAt` ON `phone_society_messages`(`updatedAt`);

-- Migration
TRUNCATE TABLE `phone_messages_conversations`;

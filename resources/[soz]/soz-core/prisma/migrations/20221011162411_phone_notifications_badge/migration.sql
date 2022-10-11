/*
  Warnings:

  - You are about to drop the column `unreadCount` on the `phone_messages_conversations` table. All the data in the column will be lost.
  - Made the column `unread` on table `phone_messages_conversations` required. This step will fail if there are existing NULL values in that column.

*/
UPDATE `phone_messages_conversations` SET `unread` = 0;
-- AlterTable

ALTER TABLE `phone_messages_conversations` DROP COLUMN `unreadCount`,
    MODIFY `unread` INTEGER NOT NULL DEFAULT 0;


/*
  Warnings:

  - A unique constraint covering the columns `[citizenId]` on the table `senate_party_member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `senate_party_member_citizenId_key` ON `senate_party_member`(`citizenId`);

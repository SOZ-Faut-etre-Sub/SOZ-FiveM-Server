-- AlterTable
ALTER TABLE `player_records_history` ADD COLUMN `delete_citizenid` VARCHAR(255) NULL,
    ADD COLUMN `deleted_at` TIMESTAMP(0) NULL;

-- AddForeignKey
ALTER TABLE `player_records_history` ADD CONSTRAINT `FK_playerrecordshistory_deletor` FOREIGN KEY (`delete_citizenid`) REFERENCES `player`(`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE;

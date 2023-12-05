-- AlterTable
ALTER TABLE `investigation` ADD COLUMN `granted_jobgrade` LONGTEXT NULL,
    ADD COLUMN `granted_services` LONGTEXT NULL,
    ADD COLUMN `in_charge` LONGTEXT NULL,
    ADD COLUMN `supervisors` LONGTEXT NULL,
    ADD COLUMN `concerned_people` LONGTEXT NULL;

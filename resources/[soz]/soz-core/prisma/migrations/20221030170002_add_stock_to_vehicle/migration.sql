-- AlterTable
ALTER TABLE `vehicles` ADD COLUMN `stock` INTEGER NULL DEFAULT 0;
UPDATE vehicles v INNER JOIN `concess_storage` cs ON v.model = cs.model SET v.stock = cs.stock;

-- DropTable
DROP TABLE `concess_storage`;

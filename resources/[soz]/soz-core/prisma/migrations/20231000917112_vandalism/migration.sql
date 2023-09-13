-- CreateTable
CREATE TABLE `vandalism_props` (
    `id` VARCHAR(50) NOT NULL,
    `kind` VARCHAR(50) NOT NULL,
    `location` VARCHAR(200) NOT NULL,
    `model_group` VARCHAR(50) NOT NULL,
    `value` INTEGER NOT NULL,

    PRIMARY KEY (`id`, `kind`)
);

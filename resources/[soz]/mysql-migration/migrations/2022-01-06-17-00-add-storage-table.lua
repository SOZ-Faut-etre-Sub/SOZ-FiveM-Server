table.insert(migrations, {
    name = "add-storage-table",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `storages` (
              `name` varchar(50) NOT NULL,
              `type` ENUM('fridge','storage','armory','seizure','trunk'),
              `owner` varchar(20) DEFAULT NULL,
              `max_slots` integer DEFAULT 10,
              `max_weight` integer DEFAULT 250000,
              `inventory` longtext DEFAULT NULL,
              PRIMARY KEY (`name`),
              KEY `type` (`type`),
              KEY `owner` (`owner`)
            ) ENGINE=InnoDB;
        ]],
    },
});


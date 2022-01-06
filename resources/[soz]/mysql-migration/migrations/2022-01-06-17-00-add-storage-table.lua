table.insert(migrations, {
    name = 'add-storage-table',
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `storages` (
              `name` varchar(50) NOT NULL,
              `type` ENUM('storage','fridge','trunk'),
              `owner` varchar(20) DEFAULT NULL,
              `inventory` longtext DEFAULT NULL,
              PRIMARY KEY (`name`),
              KEY `type` (`type`),
              KEY `owner` (`owner`)
            ) ENGINE=InnoDB;
        ]],
    }
});


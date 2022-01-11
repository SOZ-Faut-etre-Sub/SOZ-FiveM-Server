table.insert(migrations, {
    name = "add-players-table",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `players` (
                 `id` int(11) NOT NULL AUTO_INCREMENT,
                 `citizenid` varchar(50) NOT NULL,
                 `cid` int(11) DEFAULT NULL,
                 `license` varchar(255) NOT NULL,
                 `name` varchar(255) NOT NULL,
                 `money` text NOT NULL,
                 `charinfo` text DEFAULT NULL,
                 `job` text NOT NULL,
                 `gang` text DEFAULT NULL,
                 `position` text NOT NULL,
                 `metadata` text NOT NULL,
                 `inventory` longtext DEFAULT NULL,
                 `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                 PRIMARY KEY (`citizenid`),
                 KEY `id` (`id`),
                 KEY `last_updated` (`last_updated`),
                 KEY `license` (`license`)
               ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
    },
});


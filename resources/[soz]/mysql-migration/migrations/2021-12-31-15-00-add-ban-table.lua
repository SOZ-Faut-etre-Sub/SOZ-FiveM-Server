table.insert(migrations, {
    name = 'add-ban-table',
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `bans` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `name` varchar(50) DEFAULT NULL,
              `license` varchar(50) DEFAULT NULL,
              `discord` varchar(50) DEFAULT NULL,
              `ip` varchar(50) DEFAULT NULL,
              `reason` text DEFAULT NULL,
              `expire` int(11) DEFAULT NULL,
              `bannedby` varchar(255) NOT NULL DEFAULT 'LeBanhammer',
              PRIMARY KEY (`id`),
              KEY `license` (`license`),
              KEY `discord` (`discord`),
              KEY `ip` (`ip`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
    }
});


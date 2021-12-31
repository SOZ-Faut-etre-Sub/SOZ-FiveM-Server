table.insert(migrations, {
    name = 'add-permissions-table',
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `permissions` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `name` varchar(255) NOT NULL,
              `license` varchar(255) NOT NULL,
              `permission` varchar(255) NOT NULL,
              PRIMARY KEY (`id`),
              KEY `license` (`license`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
    }
});


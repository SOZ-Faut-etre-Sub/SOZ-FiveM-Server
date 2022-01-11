table.insert(migrations, {
    name = "add-player-contacts-table",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `player_contacts` (
               `id` int(11) NOT NULL AUTO_INCREMENT,
               `citizenid` varchar(50) DEFAULT NULL,
               `name` varchar(50) DEFAULT NULL,
               `number` varchar(50) DEFAULT NULL,
               `iban` varchar(50) NOT NULL DEFAULT '0',
               PRIMARY KEY (`id`),
               KEY `citizenid` (`citizenid`)
             ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
    },
});


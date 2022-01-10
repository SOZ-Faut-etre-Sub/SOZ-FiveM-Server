table.insert(migrations, {
    name = 'add-spawn-table',
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
        [[
            CREATE TABLE IF NOT EXISTS `player_outfits` (
               `id` int(11) NOT NULL AUTO_INCREMENT,
               `citizenid` varchar(50) DEFAULT NULL,
               `outfitname` varchar(50) NOT NULL,
               `model` varchar(50) DEFAULT NULL,
               `skin` text DEFAULT NULL,
               `outfitId` varchar(50) NOT NULL,
               PRIMARY KEY (`citizenid`),
               KEY `id` (`id`),
               KEY `outfitId` (`outfitId`)
            ) ENGINE=InnoDB AUTO_INCREMENT=8970;
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `playerskins` (
               `id` int(11) NOT NULL AUTO_INCREMENT,
               `citizenid` varchar(255) NOT NULL,
               `model` varchar(255) NOT NULL,
               `skin` text NOT NULL,
               `active` tinyint(2) NOT NULL DEFAULT 1,
               PRIMARY KEY (`citizenid`),
               KEY `id` (`id`),
               KEY `active` (`active`)
            ) ENGINE=InnoDB AUTO_INCREMENT=43010;
        ]],
    }
});
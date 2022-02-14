table.insert(migrations, {
    name = "add-concess-v2",
    queries = {
        [[
            DROP TABLE `player_vehicles`         
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `player_vehicles` 
            (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `license` varchar(50) DEFAULT NULL,
                `citizenid` varchar(50) DEFAULT NULL,
                `vehicle` varchar(50) DEFAULT NULL,
                `hash` varchar(50) DEFAULT NULL,
                `mods` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
                `plate` varchar(15) NOT NULL,
                `fakeplate` varchar(50) DEFAULT NULL,
                `garage` varchar(50) DEFAULT NULL,
                `fuel` int(11) DEFAULT 100,
                `engine` float DEFAULT 1000,
                `body` float DEFAULT 1000,
                `state` int(11) DEFAULT 1,
                `depotprice` int(11) NOT NULL DEFAULT 0,
                `drivingdistance` int(50) DEFAULT NULL,
                `status` text DEFAULT NULL,
                `boughttime` int(11) NOT NULL DEFAULT 0,
                `parkingtime` int(11) NOT NULL DEFAULT 0,
                PRIMARY KEY (`id`),
                KEY `plate` (`plate`),
                KEY `citizenid` (`citizenid`),
                KEY `license` (`license`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
        [[
            ALTER TABLE `player_vehicles`
            ADD UNIQUE INDEX UK_playervehicles_plate (plate);
        ]],
        [[
            ALTER TABLE `player_vehicles`
            ADD CONSTRAINT FK_playervehicles_players FOREIGN KEY (citizenid)
            REFERENCES `players` (citizenid) ON DELETE CASCADE ON UPDATE CASCADE;            
        ]],
    },
});

table.insert(migrations, {
    name = "update-player-skin-cloth",
    queries = {
        [[
            DROP TABLE IF EXISTS `playerskins`;
        ]],
        [[
            RENAME TABLE players TO player;
        ]],
        [[
            ALTER TABLE player ADD COLUMN skin TEXT, ADD COLUMN cloth_config TEXT;
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `player_cloth_set` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `citizenid` varchar(255) NOT NULL,
                `name` varchar(255) NOT NULL,
                `cloth_set` text NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB;
        ]],
        [[
            ALTER TABLE `player_cloth_set`
            ADD CONSTRAINT FK_player_cloth_set_player FOREIGN KEY (citizenid)
            REFERENCES `player` (citizenid) ON DELETE CASCADE ON UPDATE CASCADE;
        ]],
    },
});

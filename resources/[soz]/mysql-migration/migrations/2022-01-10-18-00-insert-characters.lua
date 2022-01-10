table.insert(migrations, {
    name = 'insert-characters',
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `player_temp` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `license` varchar(255) DEFAULT NULL,
                `firstname` varchar(50) DEFAULT NULL,
                `lastname` varchar(50) DEFAULT NULL,
                `nationality` varchar(50) DEFAULT NULL,
                `birthdate` varchar(10) DEFAULT NULL,
                `gender` int(1) DEFAULT NULL,
                `spawn` varchar(10) DEFAULT NULL,
                PRIMARY KEY (`id`)
              ) ENGINE=InnoDB AUTO_INCREMENT=1;              
        ]],
        [[
            INSERT INTO player_temp (
                license,
                firstname,
                lastname,
                nationality,
                birthdate,
                gender,
                spawn
            )
            VALUES (
                'license:9d9ff1287560c2f504c456b8996a7e17260373a0',
                'Ichiban',
                'Nagami',
                'Alien',
                '1990-01-01',
                'Femme',
                'South'
            );
        ]],
        [[
            INSERT INTO player_temp (
                license,
                firstname,
                lastname,
                nationality,
                birthdate,
                gender,
                spawn
            )
            VALUES (
                'license:dd4b67c37f21ceea7a5907d2b87f932e8d7466ff',
                'Dark',
                'Eagle',
                'Animal',
                '1995-01-01',
                'Homme',
                'South'
            );
        ]]
    }
});
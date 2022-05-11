table.insert(migrations, {
    name = "add-parkingstorage",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `parking_storage` (
                `parking` varchar(50) NOT NULL,
                `type` varchar(50) DEFAULT NULL,
                `stock` int(3) NOT NULL,
                PRIMARY KEY (`parking`)
            );
        ]],
        [[
            INSERT INTO `parking_storage` ( parking, type, stock) VALUES
            ('motelgarage','private',38),
            ('spanishave','private',38),
            ('greatoceanp','private',38),
            ('sandyshores','private',38),
            ('airportprivate','private',38),
            ('chumashp','private',38),
            ('stadiump','private',38),
            ('diamondp','private',38),
            ('lagunapi','private',38),
            ('beachp','private',38),
            ('themotorhotel','private',38),
            ('marinadrive','private',38),
            ('shambles','private',38),
            ('pillboxgarage','private',38)
        ;
        ]],
    },
});

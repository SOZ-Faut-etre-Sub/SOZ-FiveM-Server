table.insert(migrations, {
    name = "add-entreprise-storage",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `concess_entreprise` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `job` varchar(15) NOT NULL,
                `vehicle` varchar(15) NOT NULL,
                `price` int(10) NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
        [[
            INSERT INTO concess_entreprise (job, vehicle, price) VALUES
                ('bennys', 'flatbed3', 1000),
                ('bennys', 'minivan', 500)
            ;
        ]],
        [[
            ALTER TABLE player_vehicles
            ADD COLUMN job VARCHAR(15) DEFAULT NULL AFTER garage
            ;
        ]],
    },
});

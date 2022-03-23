table.insert(migrations, {
    name = "add-parkingentreprise-storage",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `storage_entreprise` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `job` varchar(15) NOT NULL,
                `vehicle` varchar(15) NOT NULL,
                `stock` int(3) NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
        [[
            INSERT INTO storage_entreprise (job, vehicle, stock) VALUES
                ('bennys', 'flatbed3', 5),
                ('bennys', 'minivan', 5)
            ;
        ]],
    },
});

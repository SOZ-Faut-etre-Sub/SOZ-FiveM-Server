table.insert(migrations, {
    name = "add-fuel-storage",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `fuel_storage` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `station` varchar(15) NOT NULL,
                `fuel` varchar(15) NOT NULL,
                `stock` int(10) NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
        [[
            INSERT INTO fuel_storage (station, fuel, stock) VALUES
                ('Station1', 'essence', 10000),
                ('Station2', 'essence', 10000),
                ('Station3', 'essence', 10000),
                ('Station4', 'essence', 10000),
                ('Station5', 'essence', 10000),
                ('Station6', 'essence', 10000),
                ('Station7', 'essence', 10000),
                ('Station8', 'essence', 10000),
                ('Station9', 'essence', 10000),
                ('Station10', 'essence', 10000),
                ('Station11', 'essence', 10000),
                ('Station12', 'essence', 10000),
                ('Station13', 'essence', 10000),
                ('Station14', 'essence', 10000),
                ('Station15', 'essence', 10000),
                ('Station16', 'essence', 10000),
                ('Station17', 'essence', 10000),
                ('Station18', 'essence', 10000),
                ('Station19', 'essence', 10000),
                ('Station20', 'essence', 10000),
                ('Station21', 'essence', 10000),
                ('Station22', 'essence', 10000),
                ('Station23', 'essence', 10000),
                ('Station24', 'essence', 10000),
                ('Station25', 'essence', 10000),
                ('Station26', 'essence', 10000),
                ('Station27', 'essence', 10000),
                ('Station28', 'essence', 10000)
            ;
        ]],
    },
});

table.insert(migrations, {
    name = "add-more-vehicles",
    queries = {
        [[
            INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence) VALUES
            ('rrocket', 916547552, 'Rampant Rocket', 10000, 'Motorcycles', 'luxury', 'car'),
            ('zhaba', 1284356689, 'Zhaba', 600000, 'Off-road', NULL, 'car'),
            ('hotring', 1115909093, 'Hotring Sabre', 150000, 'Sports', NULL, 'car'),
            ('patriot2', -420911112, 'Patriot Stretch', 50000, 'Suvs', 'pdm', 'car'),
            ('scramjet', -638562243, 'Scramjet', 0, 'Super', NULL, 'car'),
            ('gp1', 1234311532, 'GP1', 0, 'Super', NULL, 'car'),
            ('raiden', -1529242755, 'Raiden', 250000, 'Sports', 'luxury', 'car'),
            ('streiter', 1741861769, 'Streiter', 75000, 'Sports', 'luxury', 'car'),
            ('pfister811', -1829802492, '811', 0, 'Super', NULL, 'car'),
            ('specter2', 1074745671, 'Specter Custom', 0, 'Sports', NULL, 'car');
        ]],
        [[ UPDATE vehicles SET name = 'Sultan Classic' WHERE model = 'sultan2'; ]],
        [[ UPDATE vehicles SET name = '190z' WHERE model = 'z190'; ]],
        [[ UPDATE vehicles SET name = 'Sabre Turbo Custom' WHERE model = 'sabregt2'; ]],
        [[ UPDATE vehicles SET name = 'Desert Raid' WHERE model = 'trophytruck2'; ]],
        [[ UPDATE vehicles SET name = 'Diabolus' WHERE model = 'diablous'; ]],
        [[ UPDATE vehicles SET category = 'Super' WHERE model = 'deveste'; ]],
        [[ UPDATE vehicles SET category = 'Sports' WHERE model = 'sentinel3'; ]],
        [[ UPDATE vehicles SET price = 0 WHERE model = 'tropos'; ]],
        [[ UPDATE vehicles SET name = 'Rapid GT Classic' WHERE model = 'rapid3'; ]],
        [[ UPDATE vehicles SET dealership_id = 'luxury' WHERE category IN ('Sports', 'Sportsclassics') AND price > 0; ]],
    },
})

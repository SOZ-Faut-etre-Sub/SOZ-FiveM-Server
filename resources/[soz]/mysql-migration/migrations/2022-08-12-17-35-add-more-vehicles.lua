table.insert(migrations, {
    name = "add-more-vehicles",
    queries = {
        [[
            INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence) VALUES
            ('rrocket', 916547552, 'Rampant Rocket', 10000, 'Motorcycles', 'moto', 'moto'),
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
        [[ UPDATE vehicles SET category = 'Sports' WHERE model IN ('blista2', 'blista3', 'futo'); ]],
        [[ UPDATE vehicles SET name = 'Sultan Classic' WHERE model = 'sultan2'; ]],
        [[ UPDATE vehicles SET name = '190z' WHERE model = 'z190'; ]],
        [[ UPDATE vehicles SET name = 'Sabre Turbo Custom' WHERE model = 'sabregt2'; ]],
        [[ UPDATE vehicles SET name = 'Desert Raid' WHERE model = 'trophytruck2'; ]],
        [[ UPDATE vehicles SET name = 'Diabolus' WHERE model = 'diablous'; ]],
        [[ UPDATE vehicles SET name = 'Rapid GT Classic' WHERE model = 'rapid3'; ]],
        [[ UPDATE vehicles SET model = 'exemplar' WHERE model = 'examplar'; ]],
        [[ UPDATE vehicles SET category = 'Super' WHERE model = 'deveste'; ]],
        [[ UPDATE vehicles SET category = 'Sports' WHERE model = 'sentinel3'; ]],
        [[ UPDATE vehicles SET category = 'Sportsclassics' WHERE model IN ('manana'); ]],
        [[ UPDATE vehicles SET category = 'Utility' WHERE model IN ('slamtruck', 'sadler'); ]],
        [[ UPDATE vehicles SET category = 'Industrial' WHERE model IN ('guardian'); ]],
        [[ DELETE FROM vehicles WHERE model = 'bfinject'; ]],
        [[ UPDATE vehicles SET dealership_id = 'luxury' WHERE category IN ('Sports', 'Sportsclassics'); ]],
        [[
            UPDATE vehicles SET dealership_id = NULL WHERE model IN (
                'deluxo', 'jb700', 'jester2', 'kuruma2', 'paragonfbi', 'stromberg', 'khamelion', 'neon',
                'surge', 'dilettante2', 'issi4', 'issi5', 'issi6', 'dominator2', 'dominator4', 'dukes2',
                'dukes3', 'impaler2', 'impaler3', 'impaler4', 'imperator', 'imperator2', 'toreador',
                'imperator3', 'peyote2', 'slamvan2', 'ruiner2', 'blazer2', 'blazer5', 'caracara',
                'guardian', 'mesa3', 'slamtruck', 'sadler', 'verus', 'winky', 'baller5', 'baller6',
                'cavalcade', 'burrito', 'mule5', 'youga3', 'youga4', 'rumpo', 'speedo4', 'comet4',
                'iwagen', 'raiden', 'tezeract', 'ardent', 'deathbike', 'deathbike2', 'deathbike3'
            );
        ]],
    },
})

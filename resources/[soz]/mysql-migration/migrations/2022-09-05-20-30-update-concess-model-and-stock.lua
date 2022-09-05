table.insert(migrations, {
    name = "update-concess-model-and-stock",
    queries = {
        [[
            INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name) VALUES
                ('fusilade', 499169875, 'Fusilade', 145000, 'Sports', 'luxury', 'car', 1, null);
        ]],
        [[
            UPDATE vehicles SET price = 200000 WHERE model = 'buffalo';
        ]],
        [[
            UPDATE vehicles SET price = 220000 WHERE model = 'coquette';
        ]],
        [[
            UPDATE vehicles SET price = 250000 WHERE model = 'buffalo2';
        ]],
        [[
            INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name) VALUES
                ('buffalo3', 237764926, 'Sprunk Buffalo', 220000, 'Sports', 'luxury', 'car', 1, null);
        ]],
        [[
            UPDATE vehicles SET price = 350000 WHERE model = 'jester2';
        ]],
        [[
            UPDATE vehicles SET price = 350000 WHERE model = 'tampa2';
        ]],
        [[
            UPDATE vehicles SET price = 485000 WHERE model = 'pariah';
        ]],
        [[
            UPDATE vehicles SET price = 560000 WHERE model = 'italigto';
        ]],
        [[
            UPDATE vehicles SET price = 470000 WHERE model = 'gp1';
        ]],
        [[
            UPDATE vehicles SET price = 800000 WHERE model = 'pfister811';
        ]],
        [[
            UPDATE vehicles SET price = 76000 WHERE model = 'manana';
        ]],
        [[
            UPDATE vehicles SET price = 180000 WHERE model = 'monroe';
        ]],
        [[
            UPDATE vehicles SET price = 85000 WHERE model = 'peyote';
        ]],
        [[
            UPDATE vehicles SET price = 80000 WHERE model = 'tornado';
        ]],
        [[
            UPDATE vehicles SET price = 90000 WHERE model = 'tornado2';
        ]],
        [[
            INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name) VALUES
                ('tornado3', 1762279763, 'Tornado', 50000, 'Sportsclassics', 'luxury', 'car', 1, null),
                ('tornado4', -2033222435, 'Tornado', 40000, 'Sportsclassics', 'luxury', 'car', 1, null),
                ('tornado6', -1558399629, 'Tornado', 100000, 'Sportsclassics', 'luxury', 'car', 1, null);
        ]],
        [[
            UPDATE vehicles SET price = 92000 WHERE model = 'cheburek';
        ]],
        [[
            UPDATE vehicles SET price = 485000 WHERE model = 'cheetah2';
        ]],
        [[
            UPDATE vehicles SET price = 265000 WHERE model = 'coquette2';
        ]],
        [[
            UPDATE vehicles SET price = 120000 WHERE model = 'dynasty';
        ]],
        [[
            UPDATE vehicles SET price = 385000 WHERE model = 'feltzer3';
        ]],
        [[
            UPDATE vehicles SET price = 465000 WHERE model = 'gt500';
        ]],
        [[
            UPDATE vehicles SET price = 450000 WHERE model = 'mamba';
        ]],
        [[
            UPDATE vehicles SET price = 245000 WHERE model = 'michelli';
        ]],
        [[
            UPDATE vehicles SET price = 165000 WHERE model = 'retinue';
        ]],
        [[
            UPDATE vehicles SET price = 365000 WHERE model = 'swinger';
        ]],
        [[
            UPDATE vehicles SET price = 320000 WHERE model = 'torero';
        ]],
        [[
            UPDATE vehicles SET price = 178000 WHERE model = 'tornado5';
        ]],
        [[
            UPDATE vehicles SET price = 420000 WHERE model = 'turismo2';
        ]],
        [[
            UPDATE vehicles SET price = 350000 WHERE model = 'z190';
        ]],
        [[
            UPDATE vehicles SET price = 350000 WHERE model = 'dilettante';
        ]],
        [[
            UPDATE vehicles SET price = 300000 WHERE model = 'khamelion';
        ]],
        [[
            UPDATE vehicles SET price = 50000 WHERE model = 'surge';
        ]],
        [[
            UPDATE vehicles SET price = 750000 WHERE model = 'neon';
        ]],
        [[
            UPDATE vehicles SET price = 700000 WHERE model = 'raiden';
        ]],
        [[
            UPDATE vehicles SET price = 1000000 WHERE model = 'tezeract';
        ]],
    },
})


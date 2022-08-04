table.insert(migrations, {
    name = "balance-vehicle-price",
    queries = {
        [[
            UPDATE vehicles SET price = 45000 WHERE model = 'cogcabrio';
        ]],
        [[
            UPDATE vehicles SET price = 149900 WHERE model = 'exemplar';
        ]],
        [[
            UPDATE vehicles SET price = 84300 WHERE model = 'f620';
        ]],
        [[
            UPDATE vehicles SET price = 112400 WHERE model = 'felon';
        ]],
        [[
            UPDATE vehicles SET price = 93700 WHERE model = 'felon2';
        ]],
        [[
            UPDATE vehicles SET price = 137400 WHERE model = 'jackal';
        ]],
        [[
            UPDATE vehicles SET price = 149900 WHERE model = 'oracle2';
        ]],
        [[
            UPDATE vehicles SET price = 93700 WHERE model = 'sentinel';
        ]],
        [[
            UPDATE vehicles SET price = 109300 WHERE model = 'sentinel2';
        ]],
        [[
            UPDATE vehicles SET price = 149900 WHERE model = 'windsor';
        ]],
        [[
            UPDATE vehicles SET price = 224800 WHERE model = 'windsor2';
        ]],
        [[
            UPDATE vehicles SET price = 101500 WHERE model = 'zion';
        ]],
        [[
            UPDATE vehicles SET price = 121800 WHERE model = 'zion2';
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('voodoo', 'Voodoo', 150300, 'Muscle', 'pdm', 'car', 1);
        ]],
        [[
            UPDATE vehicles SET price = 125000 WHERE model = 'dinghy';
        ]],
        [[
            UPDATE vehicles SET price = 299000 WHERE model = 'jetmax';
        ]],
        [[
            UPDATE vehicles SET price = 413990 WHERE model = 'marquis';
        ]],
        [[
            UPDATE vehicles SET price = 16000 WHERE model = 'seashark';
        ]],
        [[
            UPDATE vehicles SET price = 325000 WHERE model = 'speeder';
        ]],
        [[
            UPDATE vehicles SET price = 375000 WHERE model = 'speeder2';
        ]],
        [[
            UPDATE vehicles SET price = 196621 WHERE model = 'squalo';
        ]],
        [[
            UPDATE vehicles SET price = 25160 WHERE model = 'suntrap';
        ]],
        [[
            UPDATE vehicles SET price = 1750000 WHERE model = 'toro';
        ]],
        [[
            UPDATE vehicles SET price = 1950000 WHERE model = 'toro2';
        ]],
        [[
            UPDATE vehicles SET price = 22000 WHERE model = 'tropic';
        ]],
        [[
            UPDATE vehicles SET price = 22000 WHERE model = 'tropic2';
        ]],
        [[
            UPDATE vehicles SET price = 2125000 WHERE model = 'longfin';
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('granger', 'Granger', 177030, 'Suvs', 'pdm', 'car', 1);
        ]],
        [[
            UPDATE vehicles SET price = 336060 WHERE model = 'huntley';
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('bfinjection', 'BF Injection', 161820, 'Off-road', 'pdm', 'car', 1);
        ]],
        [[
            UPDATE vehicles SET price = 269730 WHERE model = 'brawler';
        ]],
        [[
            UPDATE vehicles SET price = 36540 WHERE model = 'intruder';
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('schafter2', 'Schafter', 161820, 'Sedans', 'pdm', 'car', 1);
        ]],
        [[
            UPDATE vehicles SET price = 65790 WHERE model = 'washington';
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('carbonrs', 'Carbon RS', 134910, 'Motorcycles', 'moto', 'moto', 1);
        ]],
        [[
            UPDATE vehicles SET price = 273150 WHERE model = 'hakuchou2';
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('sanchez', 'Sanchez', 67410, 'Motorcycles', 'moto', 'moto', 1);
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('sanchez2', 'Sanchez II', 84420, 'Motorcycles', 'moto', 'moto', 1);
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('burrito3', 'Burrito', 84420, 'Vans', 'pdm', 'car', 1);
        ]],
    },
});

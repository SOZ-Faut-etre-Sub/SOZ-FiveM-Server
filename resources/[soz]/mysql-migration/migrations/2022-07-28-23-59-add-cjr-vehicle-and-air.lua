table.insert(migrations, {
    name = "add-cjr-vehicle-and-air",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype) VALUES
                ('taxi', 'supervolito1', 60000, 'air', 1)
            ;
        ]],
        [[
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('Taxi_heli', 'kerosene', 'private', 'taxi', 2000, '{"x": 881.51, "y": -147.86, "z": 77.28, "w": 247.39}', 1339433404, '{
                "position": {"x": 873.29, "y": -145.5, "z": 79.7},
                "length": 18.6,
                "width": 19.6,
                "options": {
                    "name": "Taxi_heli",
                    "heading": 330,
                    "minZ": 77.23,
                    "maxZ": 90.23,
                }
            }');
        ]],
    },
});

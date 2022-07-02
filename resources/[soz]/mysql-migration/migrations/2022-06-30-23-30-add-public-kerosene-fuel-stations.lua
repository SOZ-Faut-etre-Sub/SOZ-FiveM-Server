table.insert(migrations, {
    name = "add-public-kerosene-fuel-stations",
    queries = {
        [[
            INSERT INTO `fuel_storage` (station, fuel, type, stock, position, model, zone)
            VALUES ('Station40', 'kerosene', 'public', 2000, '{"x": -1155.13, "y": -2859.16, "z": 12.95, "w": 236.03}', 1339433404, '{
                    "position": {"x": -1146.8, "y": -2863.52, "z": 13.95},
                    "length": 19.4,
                    "width": 20.0,
                    "options": {
                        "name": "Station40",
                        "heading": 330.0,
                        "minZ": 12.95,
                        "maxZ": 15.95
                    }
                }');
        ]],
        [[
            INSERT INTO `fuel_storage` (station, fuel, type, stock, position, model, zone)
            VALUES ('Station41', 'kerosene', 'public', 2000, '{"x": 1719.24, "y": 3268.15, "z": 40.15, "w": 239.47}', 1339433404, '{
                    "position": {"x": 1720.76, "y": 3262.3, "z": 41.15},
                    "length": 33.2,
                    "width": 32.6,
                    "options": {
                        "name": "Station41",
                        "heading": 16.0,
                        "minZ": 40.15,
                        "maxZ": 43.15
                    }
                }');
        ]],
        [[
            INSERT INTO `fuel_storage` (station, fuel, type, stock, position, model, zone)
            VALUES ('Station42', 'kerosene', 'public', 2000, '{"x": 2109.46, "y": 4783.34, "z": 40.16, "w": 30.18}', 1339433404, '{
                    "position": {"x": 2105.31, "y": 4789.57, "z": 41.15},
                    "length": 23.6,
                    "width": 26.6,
                    "options": {
                        "name": "Station42",
                        "heading": 25.0,
                        "minZ": 40.15,
                        "maxZ": 43.15
                    }
                }');
        ]],
    },
});

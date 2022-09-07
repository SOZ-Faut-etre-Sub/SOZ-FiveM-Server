table.insert(migrations, {
    name = "add-msb-fuel-stations",
    queries = {
        [[
            -- FFS
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone) VALUES
            ('FFS_car', 'essence', 'private', 'oil', 2000, '{"x": 745.56, "y": -988.85, "z": 23.75, "w": 189.44}', 1694452750, '{
                "position": {"x": 744.47, "y": -984.33, "z": 24.73},
                "length": 10.8,
                "width": 15.4,
                "options": {
                    "name": "FFS_car",
                    "heading": 6.0,
                    "minZ": 23.73,
                    "maxZ": 27.73
                }
            }'),
            ('bahama_car', 'essence', 'private', 'oil', 2000, '{"x": -1409.65, "y": -650.65, "z": 27.67, "w": 220.93}', 1694452750, '{
                "position": {"x": -1411.4, "y": -648.72, "z": 28.67},
                "length": 8,
                "width": 15.6,
                "options": {
                    "name": "bahama_car",
                    "heading": 36,
                    "minZ": 27.67,
                    "maxZ": 31.67
                }
            }'),
            ('unicorn_car', 'essence', 'private', 'oil', 2000, '{"x": 146.92, "y": -1293.48, "z": 28.35, "w": 35.6}', 1694452750, '{
                "position": {"x": 150.56, "y": -1294.73, "z": 29.2},
                "length": 8.8,
                "width": 12.4,
                "options": {
                    "name": "unicorn_car",
                    "heading": 35,
                    "minZ": 28.35,
                    "maxZ": 31.35
                }
            }')
            ;
        ]],
    },
})

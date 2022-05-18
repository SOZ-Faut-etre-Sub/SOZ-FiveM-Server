table.insert(migrations, {
    name = "update-fuelstorage-bennys",
    queries = {
        [[
            UPDATE `fuel_storage` SET `position`= '{"x": -178.44, "y": -1323.02, "z": 30.3, "w": 270.0}', `zone` = '{
                "position": {"x": -182.46, "y": -1323.61, "z": 31.3},
                "length": 10.0,
                "width": 20.0,
                "options": {
                    "name": "Bennys_car",
                    "heading": 270.0,
                    "minZ": 30.3,
                    "maxZ": 33.3
                }
            }' WHERE `station`= 'Bennys_car';
        ]],
    },
});

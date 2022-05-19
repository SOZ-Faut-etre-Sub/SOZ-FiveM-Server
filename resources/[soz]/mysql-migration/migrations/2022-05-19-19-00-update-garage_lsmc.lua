table.insert(migrations, {
    name = "update-lsmc-fuel",
    queries = {
        [[
            UPDATE `fuel_storage`
            SET position = '{"x": 310.76, "y": -1448.76, "z": 28.77, "w": 319.62}',
            zone = '{
                    "position": {"x": 313.2, "y": -1446.1, "z": 29.97},
                    "length": 13.8,
                    "width": 6.6,
                    "options": {
                        "name": "LSMC_car",
                        "heading": 50.0,
                        "minZ": 27.87,
                        "maxZ": 32.57
                    }
                }'
            WHERE station = 'LSMC_car';
        ]],
    },
});

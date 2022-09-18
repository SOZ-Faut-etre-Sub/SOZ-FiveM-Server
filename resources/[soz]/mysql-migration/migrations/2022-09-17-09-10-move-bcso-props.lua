table.insert(migrations, {
    name = "move-bcso-props",
    queries = {
        [[
            UPDATE `fuel_storage` SET position = '{"x": 1875.38, "y": 3709.59, "z": 32.1, "w": 209.87}',
                zone = '{
                    "position": {"x": 1877.83, "y": 3706.31, "z": 33.32},
                    "length": 10.6,
                    "width": 29.8,
                    "options": {
                        "name": "BCSO_car",
                        "heading": 30.0,
                        "minZ": 32.32,
                        "maxZ": 35.32
                    }
                }'
            WHERE station = 'BCSO_car';
        ]],
    },
})

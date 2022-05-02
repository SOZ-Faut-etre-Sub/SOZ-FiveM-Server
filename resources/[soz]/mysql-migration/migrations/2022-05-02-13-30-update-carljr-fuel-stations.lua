table.insert(migrations, {
    name = "update-carljr-fuel-stations",
    queries = {
        [[
            -- CarlJr
            UPDATE `fuel_storage`
            SET position = '{"x": 897.62, "y": -157.13, "z": 75.56, "w": 48.72}',  zone = '{
                    "position": {"x": 897.49, "y": -147.82, "z": 76.66},
                    "length": 21.6,
                    "width": 15.8,
                    "options": {
                        "name": "CarlJr_car",
                        "heading": 328.0,
                        "minZ": 75.66,
                        "maxZ": 78.66
                    }
                }' WHERE station = 'CarlJr_car';
        ]],
    },
});

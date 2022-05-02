table.insert(migrations, {
    name = "update-mtp-fuel-stations",
    queries = {
        [[
            -- MTP
            UPDATE `fuel_storage`
            SET position = '{"x": -264.48, "y": 6030.92, "z": 31.12, "w": 47.48}',  zone = '{
                    "position": {"x": -269.69, "y": 6034.93, "z": 32.12},
                    "length": 15.6,
                    "width": 36.0,
                    "options": {
                        "name": "MTP_car",
                        "heading": 45.0,
                        "minZ": 31.12,
                        "maxZ": 34.12
                    }
                }' WHERE station = 'MTP_car';
        ]],
    },
});

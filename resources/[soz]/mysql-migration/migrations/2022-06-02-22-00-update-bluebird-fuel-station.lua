table.insert(migrations, {
    name = "update-bluebird-fuel-station",
    queries = {
        [[
            -- BlueBird
            UPDATE `fuel_storage`
            SET position = '{"x": -613.58, "y": -1569.11, "z": 25.75, "w": 25.73}',  zone = '{
                "position": {"x": -610.74, "y": -1575.25, "z": 26.75},
                "length": 22.2,
                "width": 15.0,
                "options": {
                    "name": "BlueBird_car",
                    "heading": 292.0,
                    "minZ": 25.75,
                    "maxZ": 28.75
                }
            }' WHERE station = 'BlueBird_car';
        ]],
    },
});

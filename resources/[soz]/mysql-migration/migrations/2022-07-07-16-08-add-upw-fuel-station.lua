table.insert(migrations, {
    name = "add-upw-fuel-station",
    queries = {
        [[
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone) VALUES
            ('UPW_car', 'essence', 'private', 'upw', 2000, '{"x": 606.52, "y": 2796.04, "z": 41.02, "w": 94.0}', 1694452750, '{
                    "position": {
                        "x": 603.91,
                        "y": 2796.55,
                        "z": 42.03
                    },
                    "length": 14.8,
                    "width": 6.6,
                    "options": {
                        "name": "upw_fuel",
                        "heading": 4.0,
                        "minZ": 41.03,
                        "maxZ": 45.03
                    }
                }')
            ;
        ]],
    },
});

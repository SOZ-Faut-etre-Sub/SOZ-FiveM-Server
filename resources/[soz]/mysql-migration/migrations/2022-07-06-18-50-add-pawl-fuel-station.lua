table.insert(migrations, {
    name = "add-pawl-fuel-station",
    queries = {
        [[
            -- PAWL
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('PAWL_car', 'essence', 'private', 'pawl', 2000, '{"x": -603.43, "y": 5287.72, "z": 69.51, "w": 132.04}', 1694452750, '{
                    "position": {"x": -598.6, "y": 5293.64, "z": 70.51},
                    "length": 31.8,
                    "width": 25.2,
                    "options": {
                        "name": "PAWL_car",
                        "heading": 41.0,
                        "minZ": 68.11,
                        "maxZ": 73.91
                    }
                }');
        ]],
    },
});

table.insert(migrations, {
    name = "update-station-13-zone",
    queries = {
        [[
            UPDATE `fuel_storage` SET zone = '{
                    "position": {
                        "x": -1800.375,
                        "y": 803.661,
                        "z": 137.651
                    },
                    "length": 15,
                    "width": 25,
                    "options": {
                        "name": "Fuel13",
                        "heading": 40.0,
                        "minZ": 137.6,
                        "maxZ": 141.6
                    }
                }' WHERE station = 'Station13';
        ]],
    },
})

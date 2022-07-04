table.insert(migrations, {
    name = "update-lspd-kerosene-zone-stations",
    queries = {
        [[
            -- LSPD
            UPDATE `fuel_storage`
            SET zone = '{
                    "position": {"x": 577.47, "y": 10.91, "z": 103.23},
                    "length": 20.6,
                    "width": 19.6,
                    "options": {
                        "name": "LSPD_heli",
                        "heading": 0.0,
                        "minZ": 102.23,
                        "maxZ": 105.23
                    }
                }' WHERE station = 'LSPD_heli';
        ]],
    },
});

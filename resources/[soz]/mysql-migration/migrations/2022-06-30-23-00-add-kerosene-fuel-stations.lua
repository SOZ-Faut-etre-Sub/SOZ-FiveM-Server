table.insert(migrations, {
    name = "add-kerosene-fuel-stations",
    queries = {
        [[
            -- BCSO
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('BCSO_heli', 'kerosene', 'private', 'bcso', 2000, '{"x": 1812.44, "y": 3714.93, "z": 32.81, "w": 85.17}', 1694452750, '{
                    "position": {"x": 1802.57, "y": 3719.19, "z": 33.77},
                    "length": 21.4,
                    "width": 24.2,
                    "options": {
                        "name": "BCSO_heli",
                        "heading": 0.0,
                        "minZ": 32.77,
                        "maxZ": 37.77
                    }
                }');
        ]],
        [[
            -- BENNYS
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('Bennys_heli', 'kerosene', 'private', 'bennys', 2000, '{"x": -143.5, "y": -1282.99, "z": 46.9, "w": 126.56}', 1694452750, '{
                    "position": {"x": -147.66, "y": -1272.8, "z": 47.9},
                    "length": 27.2,
                    "width": 22.4,
                    "options": {
                        "name": "Bennys_heli",
                        "heading": 0.0,
                        "minZ": 46.9,
                        "maxZ": 50.9
                    }
                }');
        ]],
        [[
            -- Twitch News
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('TwitchNews_heli', 'kerosene', 'private', 'news', 2000, '{"x": -582.93, "y": -921.74, "z": 35.83, "w": 2.49}', 1694452750, '{
                    "position": {"x": -583.29, "y": -927.01, "z": 36.83},
                    "length": 19.8,
                    "width": 14.6,
                    "options": {
                        "name": "TwitchNews_heli",
                        "heading": 0.0,
                        "minZ": 35.83,
                        "maxZ": 38.83
                    }
                }');
        ]],
        [[
            -- LSMC
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('LSMC_heli', 'kerosene', 'private', 'lsmc', 2000, '{"x": 300.59, "y": -1465.76, "z": 45.51, "w": 320.14}', 1694452750, '{
                    "position": {"x": 306.0, "y": -1458.92, "z": 46.51},
                    "length": 20.0,
                    "width": 39.0,
                    "options": {
                        "name": "LSMC_heli",
                        "heading": 320.0,
                        "minZ": 45.51,
                        "maxZ": 48.51
                    }
                }');
        ]],
        [[
            -- LSPD
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('LSPD_heli', 'kerosene', 'private', 'lspd', 2000, '{"x": 570.79, "y": 7.88, "z": 102.23, "w": 278.39}', 1694452750, '{
                    "position": {"x": 576.3, "y": 12.28, "z": 103.23},
                    "length": 13.0,
                    "width": 20.6,
                    "options": {
                        "name": "LSPD_heli",
                        "heading": 0.0,
                        "minZ": 102.23,
                        "maxZ": 105.23
                    }
                }');
        ]],
    },
});

table.insert(migrations, {
    name = "add-private-fuel-stations",
    queries = {
        [[
            -- BlueBird
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('BlueBird_car', 'essence', 'private', 'garbage', 2000, '{"x": -603.99, "y": -1592.31, "z": 25.76, "w": 51.26}', 1694452750, '{
                    "position": {"x": -605.21, "y": -1588.41, "z": 26.75},
                    "length": 14.6,
                    "width": 27.2,
                    "options": {
                        "name": "BlueBird_car",
                        "heading": 356.0,
                        "minZ": 25.75,
                        "maxZ": 28.75
                    }
                }');
        ]],
        [[
            -- CarlJr
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('CarlJr_car', 'essence', 'private', 'taxi', 2000, '{"x": 893.04, "y": -186.66, "z": 72.69, "w": 102.44}', 1694452750, '{
                    "position": {"x": 900.79, "y": -184.31, "z": 74.1},
                    "length": 14.2,
                    "width": 16.2,
                    "options": {
                        "name": "CarlJr_car",
                        "heading": 328.0,
                        "minZ": 73.1,
                        "maxZ": 76.1
                    }
                }');
        ]],
        [[
            -- MTP
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('MTP_car', 'essence', 'private', 'oil', 2000, '{"x": -238.9, "y": 6061.27, "z": 30.87, "w": 128.95}', 1694452750, '{
                    "position": {"x": -243.64, "y": 6059.67, "z": 31.9},
                    "length": 23.4,
                    "width": 13.8,
                    "options": {
                        "name": "MTP_car",
                        "heading": 315.0,
                        "minZ": 30.9,
                        "maxZ": 33.9
                    }
                }');
        ]],
        [[
            -- Marius
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('Marius_car', 'essence', 'private', 'food', 2000, '{"x": -1890.76, "y": 1998.11, "z": 141.1, "w": 200.08}', 1694452750, '{
                    "position": {"x": -1891.59, "y": 2001.61, "z": 142.1},
                    "length": 18.6,
                    "width": 13.4,
                    "options": {
                        "name": "Marius_car",
                        "heading": 0.0,
                        "minZ": 140.1,
                        "maxZ": 144.1
                    }
                }');
        ]],
        [[
            -- Bennys
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('Bennys_car', 'essence', 'private', 'bennys', 2000, '{"x": -236.75, "y": -1310.14, "z": 30.3, "w": 177.87}', 1694452750, '{
                    "position": {"x": -236.73, "y": -1305.34, "z": 31.3},
                    "length": 12.8,
                    "width": 14.8,
                    "options": {
                        "name": "Bennys_car",
                        "heading": 0.0,
                        "minZ": 30.3,
                        "maxZ": 33.3
                    }
                }');
        ]],
        [[
            -- STONK
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('STONK_car', 'essence', 'private', 'cash-transfer', 2000, '{"x": 29.56, "y": -611.96, "z": 30.63, "w": 340.59}', 1694452750, '{
                    "position": {"x": 32.95, "y": -607.83, "z": 31.63},
                    "length": 13.4,
                    "width": 22.4,
                    "options": {
                        "name": "STONK_car",
                        "heading": 342.0,
                        "minZ": 30.63,
                        "maxZ": 33.63
                    }
                }');
        ]],
        [[
            -- LSMC
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('LSMC_car', 'essence', 'private', 'lsmc', 2000, '{"x": 328.47, "y": -1466.25, "z": 28.77, "w": 55.63}', 1694452750, '{
                    "position": {"x": 334.85, "y": -1468.29, "z": 29.87},
                    "length": 16.4,
                    "width": 18.2,
                    "options": {
                        "name": "LSMC_car",
                        "heading": 50.0,
                        "minZ": 27.87,
                        "maxZ": 31.87
                    }
                }');
        ]],
        [[
            -- TwitchNews
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('TwitchNews_car', 'essence', 'private', 'news', 2000, '{"x": -556.44, "y": -921.29, "z": 22.88, "w": 80.19}', 1694452750, '{
                    "position": {"x": -552.05, "y": -921.49, "z": 23.88},
                    "length": 14.2,
                    "width": 16.4,
                    "options": {
                        "name": "TwitchNews_car",
                        "heading": 0.0,
                        "minZ": 22.88,
                        "maxZ": 25.88
                    }
                }');
        ]],
        [[
            -- LSPD
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('LSPD_car', 'essence', 'private', 'lspd', 2000, '{"x": 535.71, "y": -22.36, "z": 69.63, "w": 316.57}', 1694452750, '{
                    "position": {"x": 535.45, "y": -32.11, "z": 70.63},
                    "length": 20.2,
                    "width": 11.6,
                    "options": {
                        "name": "LSPD_car",
                        "heading": 30.0,
                        "minZ": 69.63,
                        "maxZ": 72.63
                    }
                }');
        ]],
        [[
            -- BCSO
            INSERT INTO `fuel_storage` (station, fuel, type, owner, stock, position, model, zone)
            VALUES ('BCSO_car', 'essence', 'private', 'bcso', 2000, '{"x": 1869.38, "y": 3702.85, "z": 32.32, "w": 120.33}', 1694452750, '{
                    "position": {"x": 1871.25, "y": 3702.58, "z": 33.32},
                    "length": 20.2,
                    "width": 22.6,
                    "options": {
                        "name": "BCSO_car",
                        "heading": 120.0,
                        "minZ": 32.32,
                        "maxZ": 35.32
                    }
                }');
        ]],
    },
});

table.insert(migrations, {
    name = "add-coords-fuel-storage",
    queries = {
        [[
            TRUNCATE TABLE `fuel_storage`;
        ]],
        [[
            ALTER TABLE fuel_storage
                ADD COLUMN position text NOT NULL,
                ADD COLUMN model INT(11) NOT NULL,
                ADD COLUMN zone text NOT NULL
            ;
        ]],
        [[
            INSERT INTO fuel_storage (station, fuel, stock, position, model, zone) VALUES
                ('Station1', 'essence', 10000, '{ "x": 49.4187, "y": 2778.793, "z": 58.043 }', -469694731, '{
                    "position": {
                        "x": 49.4187,
                        "y": 2778.793,
                        "z": 57.043
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel1",
                        "heading": 60.0,
                        "minZ": 57.0,
                        "maxZ": 61.0
                    }
                }'),
                ('Station2', 'essence', 10000, '{ "x": 263.894, "y": 2606.463, "z": 44.983 }', -462817101, '{
                    "position": {
                        "x": 263.894,
                        "y": 2606.463,
                        "z": 43.983
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel2",
                        "heading": 280.0,
                        "minZ": 43.9,
                        "maxZ": 47.9
                    }
                }'),
                ('Station3', 'essence', 10000, '{ "x": 1039.958, "y": 2671.134, "z": 39.550 }', -462817101, '{
                    "position": {
                        "x": 1039.958,
                        "y": 2671.134,
                        "z": 38.550
                    },
                    "length": 25,
                    "width": 25,
                    "options": {
                        "name": "Fuel3",
                        "heading": 260.0,
                        "minZ": 38.5,
                        "maxZ": 42.5
                    }
                }'),
                ('Station4', 'essence', 10000, '{ "x": 1207.260, "y": 2660.175, "z": 37.899 }', -462817101, '{
                    "position": {
                        "x": 1207.260,
                        "y": 2660.175,
                        "z": 36.899
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel4",
                        "heading": 40.0,
                        "minZ": 36.8,
                        "maxZ": 40.8
                    }
                }'),
                ('Station5', 'essence', 10000, '{ "x": 2539.685, "y": 2594.192, "z": 37.944 }', -462817101, '{
                    "position": {
                        "x": 2539.685,
                        "y": 2594.192,
                        "z": 36.944
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel5",
                        "heading": 20.0,
                        "minZ": 36.9,
                        "maxZ": 40.9
                    }
                }'),
                ('Station6', 'essence', 10000, '{ "x": 2679.858, "y": 3263.946, "z": 55.240 }', -469694731, '{
                    "position": {
                        "x": 2679.858,
                        "y": 3263.946,
                        "z": 54.240
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel6",
                        "heading": 150.0,
                        "minZ": 54.2,
                        "maxZ": 58.2
                    }
                }'),
                ('Station7', 'essence', 10000, '{ "x": 2005.055, "y": 3773.887, "z": 32.403 }', -469694731, '{
                    "position": {
                        "x": 2005.055,
                        "y": 3773.887,
                        "z": 31.403
                    },
                    "length": 20,
                    "width": 20,
                    "options": {
                        "name": "Fuel7",
                        "heading": 120.0,
                        "minZ": 31.4,
                        "maxZ": 35.4
                    }
                }'),
                ('Station8', 'essence', 10000, '{ "x": 1687.156, "y": 4929.392, "z": 42.078 }', -164877493, '{
                    "position": {
                        "x": 1687.156,
                        "y": 4929.392,
                        "z": 41.078
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel8",
                        "heading": 320.0,
                        "minZ": 41.0,
                        "maxZ": 45.0
                    }
                }'),
                ('Station9', 'essence', 10000, '{ "x": 1701.314, "y": 6416.028, "z": 32.763 }', 1694452750, '{
                    "position": {
                        "x": 1701.314,
                        "y": 6416.028,
                        "z": 31.763
                    },
                    "length": 20,
                    "width": 20,
                    "options": {
                        "name": "Fuel9",
                        "heading": 60.0,
                        "minZ": 31.7,
                        "maxZ": 35.7
                    }
                }'),
                ('Station10', 'essence', 10000, '{ "x": 179.857, "y": 6602.839, "z": 31.868 }', 1339433404, '{
                    "position": {
                        "x": 179.857,
                        "y": 6602.839,
                        "z": 30.868
                    },
                    "length": 30,
                    "width": 30,
                    "options": {
                        "name": "Fuel10",
                        "heading": 5.0,
                        "minZ": 30.8,
                        "maxZ": 34.8
                    }
                }'),
                ('Station11', 'essence', 10000, '{ "x": -94.4619, "y": 6419.594, "z": 31.489 }', -469694731, '{
                    "position": {
                        "x": -94.4619,
                        "y": 6419.594,
                        "z": 30.489
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel11",
                        "heading": 310.0,
                        "minZ": 30.4,
                        "maxZ": 34.4
                    }
                }'),
                ('Station12', 'essence', 10000, '{ "x": -2554.996, "y": 2334.40, "z": 33.078 }', 1339433404, '{
                    "position": {
                        "x": -2554.996,
                        "y": 2334.40,
                        "z": 32.078
                    },
                    "length": 15,
                    "width": 35,
                    "options": {
                        "name": "Fuel12",
                        "heading": 270.0,
                        "minZ": 32.0,
                        "maxZ": 36.0
                    }
                }'),
                ('Station13', 'essence', 10000, '{ "x": -1800.375, "y": 803.661, "z": 138.651 }', 1933174915, '{
                    "position": {
                        "x": -1800.375,
                        "y": 803.661,
                        "z": 137.651
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel13",
                        "heading": 40.0,
                        "minZ": 137.6,
                        "maxZ": 141.6
                    }
                }'),
                ('Station14', 'essence', 10000, '{ "x": -1437.622, "y": -276.747, "z": 46.207 }', 1339433404, '{
                    "position": {
                        "x": -1437.622,
                        "y": -276.747,
                        "z": 45.207
                    },
                    "length": 20,
                    "width": 20,
                    "options": {
                        "name": "Fuel14",
                        "heading": 37.0,
                        "minZ": 45.2,
                        "maxZ": 49.2
                    }
                }'),
                ('Station15', 'essence', 10000, '{ "x": -2096.243, "y": -320.286, "z": 13.168 }', -2007231801, '{
                    "position": {
                        "x": -2096.243,
                        "y": -320.286,
                        "z": 12.168
                    },
                    "length": 30,
                    "width": 35,
                    "options": {
                        "name": "Fuel15",
                        "heading": 170.0,
                        "minZ": 12.1,
                        "maxZ": 16.1
                    }
                }'),
                ('Station16', 'essence', 10000, '{ "x": -724.619, "y": -935.1631, "z": 19.213 }', 1933174915, '{
                    "position": {
                        "x": -724.619,
                        "y": -935.1631,
                        "z": 18.213
                    },
                    "length": 20,
                    "width": 30,
                    "options": {
                        "name": "Fuel16",
                        "heading": 0.0,
                        "minZ": 18.2,
                        "maxZ": 22.2
                    }
                }'),
                ('Station17', 'essence', 10000, '{ "x": -526.019, "y": -1211.003, "z": 18.184 }', -2007231801, '{
                    "position": {
                        "x": -526.019,
                        "y": -1211.003,
                        "z": 17.184
                    },
                    "length": 20,
                    "width": 20,
                    "options": {
                        "name": "Fuel17",
                        "heading": 60.0,
                        "minZ": 17.1,
                        "maxZ": 21.1
                    }
                }'),
                ('Station18', 'essence', 10000, '{ "x": -70.2148, "y": -1761.792, "z": 29.534 }', 1933174915, '{
                    "position": {
                        "x": -70.2148,
                        "y": -1761.792,
                        "z": 28.534
                    },
                    "length": 25,
                    "width": 35,
                    "options": {
                        "name": "Fuel18",
                        "heading": 160.0,
                        "minZ": 28.5,
                        "maxZ": 32.5
                    }
                }'),
                ('Station19', 'essence', 10000, '{ "x": 265.648, "y": -1261.309, "z": 29.292 }', -2007231801, '{
                    "position": {
                        "x": 265.648,
                        "y": -1261.309,
                        "z": 28.292
                    },
                    "length": 30,
                    "width": 35,
                    "options": {
                        "name": "Fuel19",
                        "heading": 0.0,
                        "minZ": 28.2,
                        "maxZ": 32.2
                    }
                }'),
                ('Station20', 'essence', 10000, '{ "x": 819.653, "y": -1028.846, "z": 26.403 }', 1339433404, '{
                    "position": {
                        "x": 819.653,
                        "y": -1028.846,
                        "z": 25.403
                    },
                    "length": 25,
                    "width": 25,
                    "options": {
                        "name": "Fuel20",
                        "heading": 175.0,
                        "minZ": 25.4,
                        "maxZ": 29.4
                    }
                }'),
                ('Station21', 'essence', 10000, '{ "x": 1208.951, "y": -1402.567, "z": 35.224 }', 1339433404, '{
                    "position": {
                        "x": 1208.951,
                        "y": -1402.567,
                        "z": 34.224
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel21",
                        "heading": 133.0,
                        "minZ": 34.2,
                        "maxZ": 38.2
                    }
                }'),
                ('Station22', 'essence', 10000, '{ "x": 1181.381, "y": -330.847, "z": 69.316 }', 1933174915, '{
                    "position": {
                        "x": 1181.381,
                        "y": -330.847,
                        "z": 68.316
                    },
                    "length": 20,
                    "width": 35,
                    "options": {
                        "name": "Fuel22",
                        "heading": 95.0,
                        "minZ": 68.3,
                        "maxZ": 72.3
                    }
                }'),
                ('Station23', 'essence', 10000, '{ "x": 620.843, "y": 269.100, "z": 103.089 }', 1694452750, '{
                    "position": {
                        "x": 620.843,
                        "y": 269.100,
                        "z": 102.089
                    },
                    "length": 25,
                    "width": 35,
                    "options": {
                        "name": "Fuel23",
                        "heading": 178.0,
                        "minZ": 102.0,
                        "maxZ": 106.0
                    }
                }'),
                ('Station24', 'essence', 10000, '{ "x": 2581.321, "y": 362.039, "z": 108.468 }', 1339433404, '{
                    "position": {
                        "x": 2581.321,
                        "y": 362.039,
                        "z": 107.468
                    },
                    "length": 25,
                    "width": 35,
                    "options": {
                        "name": "Fuel24",
                        "heading": 178.0,
                        "minZ": 107.4,
                        "maxZ": 111.4
                    }
                }'),
                ('Station25', 'essence', 10000, '{ "x": 176.631, "y": -1562.025, "z": 29.263 }', 1339433404, '{
                    "position": {
                        "x": 176.631,
                        "y": -1562.025,
                        "z": 28.263
                    },
                    "length": 20,
                    "width": 20,
                    "options": {
                        "name": "Fuel25",
                        "heading": 130.0,
                        "minZ": 28.2,
                        "maxZ": 32.2
                    }
                }'),
                ('Station26', 'essence', 10000, '{ "x": -319.292, "y": -1471.715, "z": 30.549 }', 1694452750, '{
                    "position": {
                        "x": -319.292,
                        "y": -1471.715,
                        "z": 29.549
                    },
                    "length": 20,
                    "width": 35,
                    "options": {
                        "name": "Fuel26",
                        "heading": 28.0,
                        "minZ": 29.5,
                        "maxZ": 33.5
                    }
                }'),
                ('Station27', 'essence', 10000, '{ "x": -66.48, "y": -2532.57, "z": 6.14 }', 1339433404, '{
                    "position": {
                        "x": -66.48,
                        "y": -2532.57,
                        "z": 5.14
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel27",
                        "heading": 52.0,
                        "minZ": 5.1,
                        "maxZ": 9.1
                    }
                }'),
                ('Station28', 'essence', 10000, '{ "x": 1784.324, "y": 3330.55, "z": 41.253 }', -462817101, '{
                    "position": {
                        "x": 1784.324,
                        "y": 3330.55,
                        "z": 40.253
                    },
                    "length": 15,
                    "width": 15,
                    "options": {
                        "name": "Fuel28",
                        "heading": 28.0,
                        "minZ": 40.2,
                        "maxZ": 44.2
                    }
                }')
            ;
        ]],
    },
});

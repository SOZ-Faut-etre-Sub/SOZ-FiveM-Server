UPDATE fuel_storage
SET position = '{"x": -263.10, "y": 6032.09, "z": 30.36, "w": 47.64}',
    zone     = '{
                    "position": {"x": -269.69, "y": 6034.93, "z": 32.12},
                    "length": 15.6,
                    "width": 36.0,
                    "options": {
                        "name": "MTP_car",
                        "heading": 45.0,
                        "minZ": 30.00,
                        "maxZ": 34.12
                    }
                }'
WHERE station = 'MTP_car';

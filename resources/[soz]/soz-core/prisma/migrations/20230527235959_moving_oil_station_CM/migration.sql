UPDATE fuel_storage
SET position = '{"x": -1907.9, "y": 1996.37, "z": 141.15, "w": 5.00}',
    zone     = '{
                    "position": {"x": -1907.98, "y": 1996.37, "z":141.15},
                    "length": 18.6,
                    "width": 13.4,
                    "options": {
                        "name": "Marius_car",
                        "heading": 0.0,
                        "minZ": 140.1,
                        "maxZ": 144.1
                    }
                }'
WHERE station = 'Marius_car';

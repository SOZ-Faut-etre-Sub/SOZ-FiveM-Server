ALTER TABLE vehicles ADD maxStock INT;

UPDATE vehicles SET maxStock = 14  WHERE category = 'Compacts';
UPDATE vehicles SET maxStock = 10  WHERE category = 'Coupes';
UPDATE vehicles SET maxStock = 6  WHERE category = 'Muscle';
UPDATE vehicles SET maxStock = 6  WHERE category = 'Suvs';
UPDATE vehicles SET maxStock = 10  WHERE category = 'Vans';
UPDATE vehicles SET maxStock = 10  WHERE category = 'Off-road';
UPDATE vehicles SET maxStock = 14  WHERE category = 'Sedans';
UPDATE vehicles SET maxStock = 10  WHERE category = 'Motorcycles';
UPDATE vehicles SET maxStock = 3  WHERE category = 'Helicopters';
UPDATE vehicles SET maxStock = 99  WHERE category = 'Cycles';
UPDATE vehicles SET maxStock = 100  WHERE category = 'Electric';
UPDATE vehicles SET maxStock = 4  WHERE category = 'Boats';
UPDATE vehicles SET maxStock = 2  WHERE dealership_id = 'luxury';

DELETE FROM vehicles where category = 'Boats';

INSERT INTO `vehicles` (`model`, `hash`, `name`, `price`, `category`, `dealership_id`, `required_licence`, `size`, `job_name`, `stock`, `radio`, `maxStock`) VALUES
    ('predator', -488123221, 'Police Predator', 0, 'Boats', NULL, 'boat', 3, NULL, 0, 1, 0),
    ('tropic3', 2003915289, 'Tropic CarlJr', 0, 'Boats', NULL, 'boat', 3, NULL, 0, 0, 0),
    ('dinghy', 276773164, 'Dinghy', 58000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('jetmax', 861409633, 'Jetmax', 320000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('marquis', -1043459709, 'Marquis', 90000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('seashark', -1030275036, 'Seashark', 8000, 'Boats', 'boat', 'boat', 1, NULL, 0, 0, 0),
    ('speeder', 231083307, 'Speeder', 240000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('speeder2', 437538602, 'Seashark Deluxe', 260000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('squalo', 400514754, 'Squalo', 180000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('suntrap', -282946103, 'Suntrap', 34000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('toro', 1070967343, 'Suntrap', 116000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('toro2', 908897389, 'Toro Deluxe', 132000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('tropic', 290013743, 'Tropic', 64000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('tropic2', 1448677353, 'Tropic Deluxe', 74000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0),
    ('longfin', 1861786828, 'Longfin', 400000, 'Boats', 'boat', 'boat', 3, NULL, 0, 0, 0);

INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype) VALUES 
    ('lspd', 'predator', 50000000, 'Boats', 0),
    ('bcso', 'predator', 50000000, 'Boats', 0),
    ('taxi', 'tropic3', 50000000, 'Boats', 0);

INSERT INTO job_grades (jobId, name, weight, salary, owner, permissions)
VALUES 
    ('gouv', 'Gouverneur', 10, 250, 1, '["manage-grade"]'),
    ('gouv', 'Assistant', 5, 200, 0, '["manage-grade"]'),
    ('sasp', 'Commissioner', 10, 250, 1, '["manage-grade"]'),
    ('sasp', 'Deputy Commissioner', 9, 200, 0, '["manage-grade"]'),
    ('sasp', 'Lieutenant', 8, 150, 0, '[]'),
    ('sasp', 'Sergeant', 5, 100, 0, '[]'),
    ('sasp', 'Trooper', 1, 50, 0, '[]');

INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype)
VALUES 
    ('sasp', 'sasp1', 100000, 'car', 0),
    ('gouv', 'xls2', 130000, 'car', 0),
    ('gouv', 'schafter6', 100000, 'car', 0);

INSERT INTO fuel_storage (station, fuel, type, owner, stock, position, model, zone)
VALUES 
    ('sasp_car', 'essence', 'private', 'sasp', 200, '{"x": -454.50, "y": -611.63, "z": 30.32, "w": 90.0}', 1694452750, '{"position": {"x": -454.50, "y": -611.63, "z": 30.32}, "length": 20.0, "width": 20.0, "options": { "name": "sasp_car", "heading": 90.0, "minZ": 28.44, "maxZ": 33.44}}'),
    ('gouv_car', 'essence', 'private', 'gouv', 200, '{"x": -454.41, "y": -626.41, "z": 30.32, "w": 90.0}', 1694452750, '{"position": {"x": -454.41, "y": -626.41, "z": 30.32}, "length": 20.0, "width": 20.0, "options": { "name": "gouv_car", "heading": 90.0, "minZ": 28.44, "maxZ": 33.44}}'); 

INSERT IGNORE INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name, stock, radio, maxStock)
VALUES 
    ('sasp1', -1530015901, 'Dominator SASP', 100000, 'Sports', null, 'car', 1, null, 0, 1, 0),
    ('xls2', -432008408, 'XLS Blindé', 130000, 'Suvs', null, 'car', 1, null, 0, 1, 0),
    ('schafter6', 1922255844, 'Schafter LWB Blindé', 100000, 'Sedans', null, 'car', 1, null, 0, 1, 0);

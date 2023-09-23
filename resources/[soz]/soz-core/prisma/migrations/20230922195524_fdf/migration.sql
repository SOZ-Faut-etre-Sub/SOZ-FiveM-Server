INSERT INTO job_grades (jobId, name, weight, salary, owner, permissions)
VALUES 
    ('fdf', 'Patron', 10, 250, 1, '["manage-grade"]');

INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype)
VALUES 
    ('fdf', 'benson', 100000, 'car', 0),
    ('fdf', 'graintrailer', 130000, 'car', 0),
    ('fdf', 'tractor2', 100000, 'car', 0);

INSERT INTO fuel_storage (station, fuel, type, owner, stock, position, model, zone)
VALUES 
    ('fdf_car', 'essence', 'private', 'fdf', 200, '{"x": 2501.11, "y": 4960.04, "z": 43.70, "w": 230.13}', 1694452750, '{"position": {"x": 2501.11, "y": 4960.04, "z": 43.70}, "length": 2.0, "width": 2.0, "options": { "name": "fef_car", "heading": 230.13, "minZ": 43.70, "maxZ": 46.70}}'); 

INSERT IGNORE INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name, stock, radio, maxStock)
VALUES 
    ('benson', 2053223216, 'Benson', 100000, 'Commercial', null, 'truck', 3, null, 0, 1, 0),
    ('graintrailer', 1019737494, 'Remorque à grain', 40000, 'Utility', null, 'truck', 3, null, 0, 0, 0),
    ('tractor2', -2076478498, 'Fieldmaster', 80000, 'Utility', null, 'truck', 1, null, 0, 1, 0);

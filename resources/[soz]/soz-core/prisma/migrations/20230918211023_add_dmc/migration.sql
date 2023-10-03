INSERT INTO job_grades (jobId, name, weight, salary, owner, permissions)
VALUES 
    ('dmc', 'Patron', 10, 250, 1, '["manage-grade"]');

INSERT INTO fuel_storage (station, fuel, type, owner, stock, position, model, zone)
VALUES 
    ('dmc_car', 'essence', 'private', 'dmc', 200, '{"x": 1068.23, "y": -1948.06, "z": 30.02, "w": 229.69}', 1694452750, '{"position": {"x": 1068.23, "y": -1948.06, "z": 30.02}, "length": 20.0, "width": 20.0, "options": { "name": "dmc_car", "heading": 90.0, "minZ": 28.44, "maxZ": 33.44}}');

INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype)
VALUES 
    ('dmc', 'tiptruck2', 60000, 'car', 0),
    ('dmc', 'rubble', 80000, 'car', 0);

INSERT IGNORE INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name, stock, radio, maxStock)
VALUES 
    ('tiptruck2', -947761570, 'Tipper', 60000, 'Industrial', null, 'truck', 1, null, 0, 1, 0),
    ('rubble', -1705304628, 'Rubble', 80000, 'Industrial', null, 'truck', 1, null, 0, 1, 0);
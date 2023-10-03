INSERT IGNORE INTO concess_entreprise (job, vehicle, price, category, liverytype)
VALUES 
    ('fdf', 'raketrailer', 40000, 'car', 0);

INSERT IGNORE INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name, stock, radio, maxStock)
VALUES 
    ('raketrailer', 390902130, 'Charrue', 40000, 'Utility', null, 'truck', 1, null, 0, 0, 0);

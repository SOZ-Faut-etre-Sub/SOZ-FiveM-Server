-- This is an empty migration.
INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name,
                                stock)
VALUES ('flatbed4', 1802061418, 'Flatbed', 45000, 'Industrial', null, 'truck', 1, null, 0);

UPDATE player_vehicles SET vehicle = 'flatbed4', hash = '1802061418' WHERE vehicle = 'flatbed3';
UPDATE player_vehicles SET mods = '{}', `condition` = '{}';

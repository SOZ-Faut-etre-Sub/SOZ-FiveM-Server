INSERT INTO job_grades (jobId, name, weight, salary, owner, permissions)
VALUES ('mdr', 'Attorney General', 10, 250, 1, '["manage-grade"]');

INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype)
VALUES ('mdr', 'deity', 165000, 'car', 12);

INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name, stock, radio)
VALUES ('deity', 1532171089, 'Deity', 165000, ' Sedans', null, 'car', 1, null, 0, 0);

INSERT INTO persistent_prop (model, position)
VALUES (1387880424, '{"x":-555.83,"y":-186.76,"z":38.26,"w":27.79}');

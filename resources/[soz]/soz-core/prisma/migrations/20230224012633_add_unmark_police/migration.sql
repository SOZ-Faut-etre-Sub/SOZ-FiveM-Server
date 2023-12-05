INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name, stock, radio)
VALUES ('lspdbana1', 1753453471, 'Felon Banalisée', 140000, 'Coupes', null, 'car', 1, null, 0, 1), ('lspdbana2', -1706526936, 'Sultan Banalisée', 140000, 'Sports', null, 'car', 1, null, 0, 1), ('bcsobana1', -934877536, 'Fugitive Banalisée', 140000, 'Sedans', null, 'car', 1, null, 0, 1), ('bcsobana2', -1158951958, 'Gresley Banalisée', 140000, 'Suvs', null, 'car', 1, null, 0, 1);

INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype)
VALUES ('lspd', 'lspdbana1', 140000, 'car', 1), ('lspd', 'lspdbana2', 140000, 'car', 1), ('bcso', 'bcsobana1', 140000, 'car', 1), ('bcso', 'bcsobana2', 140000, 'car', 1);

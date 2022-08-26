table.insert(migrations, {
    name = "add-fbi-vehicles",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype)
            VALUES
                ('fbi', 'cogfbi', 30000, 'car', 0),
                ('fbi', 'paragonfbi', 30000, 'car', 0),
                ('fbi', 'fbi', 30000, 'car', 0);
        ]],
        [[
            INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence, size, job_name)
            VALUES ('fbi', 1127131465, 'FBI', 30000, 'Sedans', null, 'car', 1, null);
        ]],
    },
})

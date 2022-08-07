table.insert(migrations, {
    name = "add-taco1",
    queries = {
        [[
            INSERT INTO vehicles (model, hash, name, price, category, dealership_id, required_licence) VALUES
                ('taco1', -116590740, 'Taco', 0, 'Commercial', NULL, 'truck')
            ;
        ]],
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype) VALUES
                ('food', 'taco1', 20000, 1)
            ;
        ]],
    },
})

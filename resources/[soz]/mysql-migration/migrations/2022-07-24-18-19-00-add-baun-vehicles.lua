table.insert(migrations, {
    name = "add-baun-vehicles",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype) VALUES
                ('baun', 'youga3', 30000, 1)
            ;
        ]],
    },
})

table.insert(migrations, {
    name = "add-ffs-vehicles",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype) VALUES
                ('ffs', 'boxville', 24000, 2)
            ;
        ]],
    },
})

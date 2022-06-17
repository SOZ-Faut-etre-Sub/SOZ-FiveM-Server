table.insert(migrations, {
    name = "add-firetruk-lsmc-shop",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype) VALUES ('lsmc', 'firetruk', 35000, 1);
        ]],
    },
})

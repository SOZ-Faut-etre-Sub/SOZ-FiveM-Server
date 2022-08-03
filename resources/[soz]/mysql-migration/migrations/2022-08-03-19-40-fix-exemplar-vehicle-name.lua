table.insert(migrations, {
    name = "fix-exemplar-vehicle-name",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype) VALUES
                ('taxi', 'supervolito1', 60000, 'air', 1)
            ;
        ]],
    },
});

table.insert(migrations, {
    name = "add-taxi-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('taxi', 'dynasty', 24000);
        ]],
    },
});

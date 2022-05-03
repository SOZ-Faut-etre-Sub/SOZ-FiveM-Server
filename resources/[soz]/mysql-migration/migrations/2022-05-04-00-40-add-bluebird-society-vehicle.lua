table.insert(migrations, {
    name = "add-bluebird-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('garbage', 'trash', 18000);
        ]],
    },
});

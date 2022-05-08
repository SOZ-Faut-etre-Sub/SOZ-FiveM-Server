table.insert(migrations, {
    name = "add-food-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('food', 'mule2', 26000);
        ]],
    },
});

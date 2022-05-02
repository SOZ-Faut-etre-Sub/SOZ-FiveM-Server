table.insert(migrations, {
    name = "add-lspd-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('lspd', 'police5', 35000),
                   ('lspd', 'police6', 45000),
                   ('lspd', 'policeb', 25000),
                   ('lspd', 'polmav', 45000);
        ]],
    },
});

table.insert(migrations, {
    name = "add-cash-transfer-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('cash-transfer', 'stockade', 30000),
                   ('cash-transfer', 'baller4', 45000);
        ]],
    },
});

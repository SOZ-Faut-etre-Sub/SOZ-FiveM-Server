table.insert(migrations, {
    name = "add-lsmc-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('lsmc', 'ambulance', 25000),
                   ('lsmc', 'ambcar', 35000),
                   ('lsmc', 'polmav', 45000);
        ]],
    },
});

table.insert(migrations, {
    name = "add-bcso-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('bcso', 'sheriff3', 35000),
                   ('bcso', 'sheriff4', 45000),
                   ('bcso', 'sheriffb', 25000),
                   ('bcso', 'polmav', 45000);
        ]],
    },
});

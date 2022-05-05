table.insert(migrations, {
    name = "add-twitchnews-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('news', 'newsvan', 26000),
                   ('news', 'frogger', 45000);
        ]],
    },
});

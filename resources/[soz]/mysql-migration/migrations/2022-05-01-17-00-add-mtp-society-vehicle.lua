table.insert(migrations, {
    name = "add-mtp-society-vehicle",
    queries = {
        [[
            INSERT INTO `concess_entreprise` (job, vehicle, price)
            VALUES ('oil', 'packer', 27000), ('oil', 'tanker', 10000), ('oil', 'utillitruck2', 20000);
        ]],
    },
});

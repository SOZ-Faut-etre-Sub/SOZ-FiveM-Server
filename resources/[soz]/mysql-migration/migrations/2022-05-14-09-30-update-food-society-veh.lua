table.insert(migrations, {
    name = "update-food-society-veh",
    queries = {
        [[
            UPDATE `concess_entreprise`
            SET vehicle = 'mule6'
            WHERE job = 'food' AND vehicle = 'mule2';
        ]],
    },
});

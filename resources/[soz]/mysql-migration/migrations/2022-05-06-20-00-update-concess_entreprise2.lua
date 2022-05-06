table.insert(migrations, {
    name = "update-concess-entreprise2",
    queries = {
        [[
            UPDATE `concess_entreprise` SET `vehicle`='burrito2' WHERE `vehicle`= 'gburrito2'
        ]],
    },
});

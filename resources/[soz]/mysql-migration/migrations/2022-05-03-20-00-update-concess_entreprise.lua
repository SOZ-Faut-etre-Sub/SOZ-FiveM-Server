table.insert(migrations, {
    name = "update-concess-entreprise",
    queries = {
        [[
            UPDATE `concess_entreprise` SET `vehicle`='gburrito2', `price` = 26000 WHERE `vehicle`= 'minivan'
        ]],
        [[
            UPDATE `concess_entreprise` SET `price` = 32000 WHERE `vehicle`= 'flatbed3'
        ]],
    },
});

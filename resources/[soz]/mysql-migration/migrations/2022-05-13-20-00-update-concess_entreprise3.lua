table.insert(migrations, {
    name = "update-concess-entreprise3",
    queries = {
        [[
            ALTER table concess_entreprise add liverytype int(3) not null after price;
        ]],
        [[
            UPDATE `concess_entreprise` SET `liverytype`= 1 WHERE `vehicle`= 'flatbed3'
        ]],
    },
});

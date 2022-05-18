table.insert(migrations, {
    name = "update-concessvelostorage",
    queries = {
        [[
            UPDATE `concess_storage`
            SET stock = 20
            WHERE category = 'Cycles';
        ]],
    },
});

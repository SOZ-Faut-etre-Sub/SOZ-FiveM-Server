table.insert(migrations, {
    name = "update-stock-concess-velo",
    queries = {
        [[
            UPDATE `concess_storage`
            SET stock = 40
            WHERE category = 'Cycles';
        ]],
    },
});

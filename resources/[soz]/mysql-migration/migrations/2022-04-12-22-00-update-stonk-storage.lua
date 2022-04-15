table.insert(migrations, {
    name = "update-stonk-storage",
    queries = {
        [[
            UPDATE storages SET max_weight = 1000000 WHERE name = 'stonk_storage';
        ]],
    },
});

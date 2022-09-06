table.insert(migrations, {
    name = "wipe-baun-storages",
    queries = {
        [[
            DELETE FROM storages WHERE owner = 'baun';
        ]],
    },
})

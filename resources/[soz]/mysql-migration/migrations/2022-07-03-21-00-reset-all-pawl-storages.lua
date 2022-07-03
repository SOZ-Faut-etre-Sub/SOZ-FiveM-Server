table.insert(migrations, {
    name = "reset-all-pawl-storages",
    queries = {
        [[
            DELETE FROM storages WHERE owner = 'pawl';
        ]],
    },
})

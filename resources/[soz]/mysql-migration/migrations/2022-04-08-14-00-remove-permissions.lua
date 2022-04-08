table.insert(migrations, {
    name = "remove-permissions",
    queries = {
        [[
            drop table permissions;
        ]],
    },
});

table.insert(migrations, {
    name = "add-storage-tank-type",
    queries = {
        [[
            alter table storages alter column max_slots set default 1;
        ]],
        [[
            alter table storages alter column max_weight set default 1000;
        ]],
    },
});

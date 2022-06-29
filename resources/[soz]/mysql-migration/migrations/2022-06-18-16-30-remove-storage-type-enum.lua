table.insert(migrations, {
    name = "remove-storage-type-enum",
    queries = {
        [[
            alter table storages modify type varchar(50) null;
        ]],
    },
});

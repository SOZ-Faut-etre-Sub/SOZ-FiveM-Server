table.insert(migrations, {
    name = "update-storage-owner-length",
    queries = {
        [[
            alter table storages modify owner varchar(64) null;
        ]],
    },
})

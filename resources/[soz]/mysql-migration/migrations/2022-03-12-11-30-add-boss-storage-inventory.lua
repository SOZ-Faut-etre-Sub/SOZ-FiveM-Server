table.insert(migrations, {
    name = "add-boss-storage-inventory",
    queries = {
        [[
           alter table storages modify type enum ('fridge', 'storage', 'boss_storage', 'stash', 'armory', 'seizure', 'trunk') null;
        ]],
    },
});

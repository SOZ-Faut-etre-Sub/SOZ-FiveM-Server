table.insert(migrations, {
    name = "add-ammo-storage-type",
    queries = {
        [[
            alter table storages modify type enum ('fridge', 'storage', 'boss_storage', 'stash', 'armory', 'seizure', 'trunk', 'ammo') null;
        ]],
    },
});

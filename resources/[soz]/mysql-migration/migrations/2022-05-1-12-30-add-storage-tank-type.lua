table.insert(migrations, {
    name = "add-storage-tank-type",
    queries = {
        [[
            alter table storages modify type enum ('fridge', 'storage', 'storage_tank', 'boss_storage', 'stash', 'armory', 'seizure', 'trunk', 'ammo') null;
        ]],
    },
});

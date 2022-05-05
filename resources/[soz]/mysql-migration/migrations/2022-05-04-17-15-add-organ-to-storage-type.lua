table.insert(migrations, {
    name = "add-organ-to-storage-type",
    queries = {
        [[
            alter table storages
            modify type enum ('fridge', 'storage', 'storage_tank', 'boss_storage', 'stash', 'armory', 'seizure', 'trunk', 'ammo', 'organ') null;
        ]],
    },
});

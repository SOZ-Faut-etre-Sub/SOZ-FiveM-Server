table.insert(migrations, {
    name = "remove-parkingentreprise-storage",
    queries = {
        [[
            drop table storage_entreprise;
        ]],
    },
});

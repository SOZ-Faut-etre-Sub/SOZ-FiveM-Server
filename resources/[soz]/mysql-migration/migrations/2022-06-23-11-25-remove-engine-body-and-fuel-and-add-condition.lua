table.insert(migrations, {
    name = "remove-engine-body-and-fuel-and-add",
    queries = {
        [[
            ALTER TABLE player_vehicles add `condition` longtext after mods;
        ]],
    },
})

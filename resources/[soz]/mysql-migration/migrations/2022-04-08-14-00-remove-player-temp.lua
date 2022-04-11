table.insert(migrations, {
    name = "remove-player-temp",
    queries = {
        [[
            drop table player_temp;
        ]],
    },
});

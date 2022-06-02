table.insert(migrations, {
    name = "delete-housing-doublon",
    queries = {
        [[
            DELETE FROM player_house WHERE id = 109;
        ]],
        [[
            DELETE FROM player_house WHERE id = 110;
        ]],
    },
});

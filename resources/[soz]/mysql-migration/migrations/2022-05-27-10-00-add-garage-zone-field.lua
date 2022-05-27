table.insert(migrations, {
    name = "add-garage-zone-field",
    queries = {
        [[
            ALTER TABLE player_house ADD garage_zone LONGTEXT NULL;
        ]],
    },
});

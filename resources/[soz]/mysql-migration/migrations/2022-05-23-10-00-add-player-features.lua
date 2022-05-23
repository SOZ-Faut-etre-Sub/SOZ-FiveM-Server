table.insert(migrations, {
    name = "add-player-feature-field",
    queries = {
        [[
            ALTER TABLE player ADD COLUMN features TEXT DEFAULT "[]";
        ]],
    },
});

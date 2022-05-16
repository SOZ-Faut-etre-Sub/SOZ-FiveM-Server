table.insert(migrations, {
    name = "add-reporter-id",
    queries = {
        [[
            alter table phone_twitch_news add reporterId varchar(70) null after reporter;
        ]],
    },
});

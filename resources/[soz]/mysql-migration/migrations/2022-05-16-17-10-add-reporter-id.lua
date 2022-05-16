table.insert(migrations, {
    name = "add-society-message-taken-by-username",
    queries = {
        [[
            alter table phone_twitch_news add reporterId varchar(70) null after reporter;
        ]],
    },
});

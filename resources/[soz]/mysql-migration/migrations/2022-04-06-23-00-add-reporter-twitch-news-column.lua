table.insert(migrations, {
    name = "add-reporter-twitch-news-column",
    queries = {
        [[
            alter table phone_twitch_news add reporter varchar(150) null after type;
        ]],
    },
});

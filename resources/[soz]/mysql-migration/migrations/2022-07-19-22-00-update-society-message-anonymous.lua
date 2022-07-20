table.insert(migrations, {
    name = "update-society-message-anonymous",
    queries = {
        [[
            alter table phone_society_messages modify source_phone varchar(10) not null;
        ]],
    },
});

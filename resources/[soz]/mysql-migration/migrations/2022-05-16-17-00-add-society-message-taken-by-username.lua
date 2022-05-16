table.insert(migrations, {
    name = "add-society-message-taken-by-username",
    queries = {
        [[
            alter table phone_society_messages add takenByUsername varchar(70) null after takenBy;
        ]],
    },
});

table.insert(migrations, {
    name = "add-society-message-taken-by",
    queries = {
        [[
            alter table phone_society_messages add takenBy varchar(70) null after isTaken;
        ]],
    },
});

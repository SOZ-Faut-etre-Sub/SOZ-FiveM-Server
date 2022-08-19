table.insert(migrations, {
    name = "increase-note-length",
    queries = {
        [[
            alter table phone_notes modify title varchar(128) not null;
        ]],
        [[
            alter table phone_notes modify content varchar(1024) not null;
        ]],
    },
})

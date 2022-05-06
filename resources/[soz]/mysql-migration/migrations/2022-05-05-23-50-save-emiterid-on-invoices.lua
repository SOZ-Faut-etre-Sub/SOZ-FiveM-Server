table.insert(migrations, {
    name = "save-emiterid-on-invoices",
    queries = {
        [[
            alter table invoices add emitterSafe varchar(50) not null after emitterName;
        ]],
        [[
            alter table invoices add refused tinyint(1) default 0 not null after payed;
        ]],
    },
});

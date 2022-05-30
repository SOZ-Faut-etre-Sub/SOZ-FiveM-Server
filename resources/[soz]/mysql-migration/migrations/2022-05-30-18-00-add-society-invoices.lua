table.insert(migrations, {
    name = "add-society-invoices",
    queries = {
        [[
            alter table invoices add targetAccount varchar(20) null after emitterSafe;
        ]],
        [[
            update invoices set targetAccount = (select JSON_VALUE(player.charinfo,'$.account') as account from player where player.citizenid = invoices.citizenid);
        ]],
    },
});

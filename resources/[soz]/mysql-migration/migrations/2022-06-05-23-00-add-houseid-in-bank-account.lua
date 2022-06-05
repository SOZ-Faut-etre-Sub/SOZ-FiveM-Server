table.insert(migrations, {
    name = "add-houseid-in-bank-account",
    queries = {
        [[
            alter table bank_accounts add houseid varchar(50) null after businessid;
        ]],
    },
})

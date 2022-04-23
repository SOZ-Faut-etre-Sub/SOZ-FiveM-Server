table.insert(migrations, {
    name = "add-bank-accounts-coords-column",
    queries = {
        [[
            ALTER TABLE bank_accounts ADD coords text NULL;
        ]],
    },
});

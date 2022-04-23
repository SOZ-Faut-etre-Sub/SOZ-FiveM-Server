table.insert(migrations, {
    name = "add-bank-accounts-coords-column",
    queries = {
        [[
            DELETE FROM bank_accounts WHERE account_type = 'bank-atm';
        ]],
        [[
            ALTER TABLE bank_accounts ADD IF NOT EXISTS coords text NULL;
        ]],
    },
});

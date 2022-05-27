table.insert(migrations, {
    name = "reset-business-account",
    queries = {
        [[
            DELETE FROM bank_accounts WHERE account_type = 'business';
        ]],
    },
});

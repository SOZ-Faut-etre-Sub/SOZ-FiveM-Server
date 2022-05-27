table.insert(migrations, {
    name = "reset-business-account",
    queries = {
        [[
            DELETE bank_accounts WHERE account_type = 'business';
        ]],
    },
});

table.insert(migrations, {
    name = "add-luxury-dealership-bank-account",
    queries = {
        [[
            INSERT INTO bank_accounts (businessid, account_type, money) VALUES ('luxury_dealership', 'business', 0);
        ]],
    },
})

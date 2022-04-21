table.insert(migrations, {
    name = "update-bank-account-types-enum",
    queries = {
        [[
            ALTER TABLE bank_accounts MODIFY COLUMN account_type enum('player','business','safestorages','offshore', 'bank-atm') DEFAULT 'player' NOT NULL;
        ]],
    },
});

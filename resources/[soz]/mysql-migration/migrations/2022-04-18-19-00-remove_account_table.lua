table.insert(migrations, {
    name = "remove-account-table",
    queries = {
        [[
            DROP TABLE IF EXISTS `AccountIdentity`;
        ]],
        [[
            DROP TABLE IF EXISTS `InvitationCode`;
        ]],
        [[
            DROP TABLE IF EXISTS `Account`;
        ]],
    },
});

table.insert(migrations, {
    name = "fix-money-cents",
    queries = {
        [[
            UPDATE player SET money = JSON_SET(money, '$.money', ROUND(JSON_VALUE(money,'$.money')));
        ]],
    },
})

table.insert(migrations, {
    name = "clean-vehicle-price-database",
    queries = {
        [[
            DELETE FROM player_vehicles WHERE plate IN ('6MJ267PX', '1VU064DD', '5KT696IN', '2FG396ZD', '7FE967CG', '6BV448TQ', '5JP196ZU', '4NB550JX');
        ]],
        [[
            UPDATE bank_accounts SET money = money + 7000 WHERE accountid = '471Z2832T349';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 15000 WHERE accountid = '472Z2504T904';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 101000 WHERE accountid = '525Z8619T795';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 22000 WHERE accountid = '810Z4693T634';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 21000 WHERE accountid = '813Z5730T224';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 80000 WHERE accountid = '926Z2996T447';
        ]],
    },
})

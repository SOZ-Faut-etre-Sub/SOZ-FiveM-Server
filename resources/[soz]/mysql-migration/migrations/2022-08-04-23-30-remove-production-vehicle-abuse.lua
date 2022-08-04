table.insert(migrations, {
    name = "remove-production-vehicle-abuse",
    queries = {
        [[
            UPDATE bank_accounts SET money = money - 11240 WHERE accountid = '508Z7771T272';
        ]],
        [[
            UPDATE bank_accounts SET money = money - 14990 WHERE accountid = '506Z4482T861';
        ]],
        [[
            UPDATE bank_accounts SET money = money - 13740 WHERE accountid = '527Z1914T376';
        ]],
        [[
            UPDATE bank_accounts SET money = money - 93700 WHERE accountid = '307Z6448T902';
        ]],
        --
        [[
            UPDATE bank_accounts SET money = money + 43470 WHERE accountid = '327Z3230T241';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 43470 WHERE accountid = '268Z6332T116';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 43470 WHERE accountid = '336Z1788T423';
        ]],
        --
        [[
            DELETE FROM player_vehicles WHERE plate = '2PX527DF' AND citizenid = 'NSQ30320';
        ]],
        [[
            DELETE FROM player_vehicles WHERE plate = '3TY565WP' AND citizenid = 'RTB13022';
        ]],
        [[
            DELETE FROM player_vehicles WHERE plate = '2OP044MJ' AND citizenid = 'WRL49332';
        ]],
        --
        [[
            UPDATE concess_storage SET stock = stock + 3 WHERE model = 'huntley';
        ]],
    },
});

table.insert(migrations, {
    name = "update-vehicle-sentinel",
    queries = {
        [[
            UPDATE vehicles SET name = 'Sentinel XS' WHERE model = 'sentinel';
        ]],
        [[
            UPDATE vehicles SET name = 'Sentinel' WHERE model = 'sentinel2';
        ]],
        [[
            DELETE FROM player_vehicles WHERE plate = '8BB171VU';
        ]],
        [[
            UPDATE bank_accounts SET money = money + 93700 WHERE accountid = '985Z4566T371';
        ]],
        [[
            UPDATE concess_storage SET stock = stock + 1 WHERE model = 'sentinel';
        ]],
    },
})

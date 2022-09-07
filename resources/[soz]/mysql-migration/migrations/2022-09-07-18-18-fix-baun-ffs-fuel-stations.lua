table.insert(migrations, {
    name = "fix-baun-ffs-fuel-stations",
    queries = {
        [[
            UPDATE fuel_storage SET owner = 'baun' WHERE station IN ('bahama_car', 'unicorn_car');
        ]],
        [[
            UPDATE fuel_storage SET owner = 'ffs' WHERE station = 'FFS_car';
        ]],
        [[
            DELETE FROM storages WHERE name = 'baun_boss_storage';
        ]],
    },
})

table.insert(migrations, {
    name = "add-dynamic-fuel-price",
    queries = {
        [[
            alter table fuel_storage add price float(10, 2) default 0 null after stock;
        ]],
        [[
            UPDATE fuel_storage SET price = 1.0 WHERE fuel='essence' AND type='public';
        ]],
        [[
            UPDATE fuel_storage SET price = 3.0 WHERE fuel='kerosene' AND type='public';
        ]],
    },
});

table.insert(migrations, {
    name = "update-default-fuel-station-stock",
    queries = {
        [[
            UPDATE `fuel_storage` SET `stock` = 2000 WHERE `stock` > 2000;
        ]],
    },
});

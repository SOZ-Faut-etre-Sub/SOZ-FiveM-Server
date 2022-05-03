table.insert(migrations, {
    name = "update-station-stock",
    queries = {
        [[
            UPDATE `fuel_storage` SET `stock`=2000 WHERE `stock`= 10000;
        ]],
    },
});

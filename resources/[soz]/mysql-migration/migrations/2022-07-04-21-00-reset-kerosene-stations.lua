table.insert(migrations, {
    name = "reset-kerosene-stations",
    queries = {
        [[
            UPDATE fuel_storage SET stock = 0 WHERE fuel = 'kerosene';
        ]],
    },
})

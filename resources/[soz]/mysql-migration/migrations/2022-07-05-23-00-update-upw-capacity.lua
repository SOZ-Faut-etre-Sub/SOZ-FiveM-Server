table.insert(migrations, {
    name = "update-upw-capacity",
    queries = {
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.capacity', 1000) WHERE type = 'terminal';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.maxCapacity', 5000) WHERE type = 'inverter';
        ]],
    },
})

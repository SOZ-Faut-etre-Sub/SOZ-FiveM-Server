table.insert(migrations, {
    name = "update-upw-balance-3",
    queries = {
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.max', 10) WHERE identifier = 'wind1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.max', 8) WHERE identifier = 'hydro1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.min', 5) WHERE identifier = 'hydro1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.wastePerMinute.max', 4) WHERE identifier = 'hydro1';
        ]],
    },
});

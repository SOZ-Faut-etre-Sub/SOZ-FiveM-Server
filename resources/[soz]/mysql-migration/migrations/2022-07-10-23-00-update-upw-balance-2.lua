table.insert(migrations, {
    name = "update-upw-balance-2",
    queries = {
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.max', 9) WHERE identifier = 'wind1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.max', 6) WHERE identifier = 'hydro1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.min', 4) WHERE identifier = 'hydro1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.pollutionPerUnit', 0.05) WHERE identifier = 'wind1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.pollutionPerUnit', 0.5) WHERE identifier = 'fossil1';
        ]],
    },
});

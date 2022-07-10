table.insert(migrations, {
    name = "update-upw-balance",
    queries = {
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.maxCapacity', 1500) WHERE identifier IN ('hydro1' , 'wind1');
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.capacity', 1500) WHERE identifier IN ('hydro1' , 'wind1');
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.max', 4) WHERE identifier = 'wind1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.max', 3) WHERE identifier = 'hydro1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.min', 2) WHERE identifier = 'hydro1';
        ]],
    },
});

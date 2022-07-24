table.insert(migrations, {
    name = "update-upw-wind-facility",
    queries = {
        [[
             UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.min', 1) WHERE identifier = 'wind1';
        ]],
        [[
             UPDATE upw_facility SET data = JSON_SET(data, '$.productionPerMinute.max', 8) WHERE identifier = 'wind1';
        ]],
    },
});

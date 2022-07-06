table.insert(migrations, {
    name = "update-inverter-polyzone",
    queries = {
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.zone.sx', 5.0) WHERE type = 'inverter';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.zone.sy', 5.0) WHERE type = 'inverter';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.zone.maxZ', JSON_VALUE(data, '$.zone.maxZ') + 1.0) WHERE type = 'inverter';
        ]],
    },
});

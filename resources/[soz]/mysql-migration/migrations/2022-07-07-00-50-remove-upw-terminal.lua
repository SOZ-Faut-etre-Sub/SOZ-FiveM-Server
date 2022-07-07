table.insert(migrations, {
    name = "remove-upw-terminal",
    queries = {
        [[
            DELETE FROM upw_facility WHERE identifier = 'terminal1';
        ]],
        [[
            UPDATE upw_facility SET data = JSON_SET(data, '$.zone.heading', 105) WHERE identifier = 'terminal1657037877';
        ]],
    },
});

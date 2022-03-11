table.insert(migrations, {
    name = "migrate-phone-number",
    queries = {
        [[
            UPDATE players
            SET charinfo = JSON_REMOVE(charinfo, '$.phone')
            WHERE LENGTH(JSON_VALUE(charinfo,'$.phone')) > 8
            ;
        ]],
    },
});

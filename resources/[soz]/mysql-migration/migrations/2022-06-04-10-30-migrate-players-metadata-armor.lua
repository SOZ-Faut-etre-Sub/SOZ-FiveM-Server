table.insert(migrations, {
    name = "migrate-players-metadata-armor",
    queries = {
        [[
            UPDATE player
            SET metadata = JSON_SET(metadata, '$.armor', JSON_OBJECT(
                'current', 0,
                'hidden', false
            ))
        ]],
    },
})

table.insert(migrations, {
    name = "migrate-players-metadata-inside",
    queries = {
        [[
            UPDATE player
            SET metadata = JSON_SET(metadata, '$.inside', JSON_OBJECT(
                'exitCoord', false,
                'apartment', false
            ))
        ]],
    },
})

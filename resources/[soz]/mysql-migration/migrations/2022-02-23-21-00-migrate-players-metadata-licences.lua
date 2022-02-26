table.insert(migrations, {
    name = "migrate-players-metadata-licences",
    queries = {
        [[
            UPDATE players
            SET metadata = JSON_SET(metadata, '$.licences', JSON_OBJECT(
                'car', 0,
                'truck', 0,
                'motorcycle', 0,
                'heli', 0,
                'boat', 0,
                'weapon', false,
                'hunting', false,
                'fishing', false,
                'rescuer', false
            ))
        ]],
    }
})

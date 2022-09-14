table.insert(migrations, {
    name = "reset-msb-metadata",
    queries = {
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.fiber', 70) ]],
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.lipid', 70) ]],
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.sugar', 70) ]],
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.protein', 70) ]],
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.max_stamina', 100) ]],
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.strength', 120) ]],
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.stress_level', 0) ]],
        [[ UPDATE player SET metadata = JSON_SET(metadata, '$.health_level', 100) ]],
    },
})

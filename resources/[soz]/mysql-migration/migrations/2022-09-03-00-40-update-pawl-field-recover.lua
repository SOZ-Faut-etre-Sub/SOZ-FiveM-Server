table.insert(migrations, {
    name = "update-pawl-field-recover",
    queries = {
        [[
           UPDATE field SET data = JSON_SET(data, '$.refillDelay', 14400000) WHERE owner = 'pawl';
        ]],
    },
})

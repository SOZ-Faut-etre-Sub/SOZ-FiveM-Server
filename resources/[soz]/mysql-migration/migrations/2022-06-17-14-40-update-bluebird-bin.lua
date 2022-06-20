table.insert(migrations, {
    name = "update-bluebird-bin",
    queries = {
        [[
            UPDATE persistent_prop SET model = '-311038351' WHERE model = '1010534896';
        ]],
    },
})

table.insert(migrations, {
    name = "update-properties-price",
    queries = {
        [[
            UPDATE housing_apartment SET price = 72000 WHERE identifier LIKE 'south_house_low%';
        ]],
        [[
            UPDATE housing_apartment SET price = 90000 WHERE identifier LIKE 'south_house_mid%';
        ]],
        [[
            UPDATE housing_apartment SET price = 116000 WHERE identifier LIKE 'soz_appartements%';
        ]],
        [[
            UPDATE housing_apartment SET price = 400000 WHERE identifier LIKE 'soz_villa%';
        ]],
    },
})

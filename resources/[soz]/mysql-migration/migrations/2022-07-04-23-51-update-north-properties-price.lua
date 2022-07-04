table.insert(migrations, {
    name = "update-north-properties-price",
    queries = {
        [[
            UPDATE housing_apartment SET price = 39000 WHERE identifier LIKE 'v_trailer%';
        ]],
        [[
            UPDATE housing_apartment SET price = 64000 WHERE identifier LIKE 'north_house_low%';
        ]],
        [[
            UPDATE housing_apartment SET price = 98000 WHERE identifier LIKE 'north_house_mid%';
        ]],
    },
})

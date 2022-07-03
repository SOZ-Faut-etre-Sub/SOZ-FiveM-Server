table.insert(migrations, {
    name = "update-properties-price",
    queries = {
        [[
            alter table housing_apartment set price = 72000 where identifier LIKE 'south_house_low%';
        ]],
        [[
            alter table housing_apartment set price = 90000 where identifier LIKE 'south_house_mid%';
        ]],
        [[
            alter table housing_apartment set price = 116000 where identifier LIKE 'soz_appartements%';
        ]],
        [[
            alter table housing_apartment set price = 400000 where identifier LIKE 'soz_villa%';
        ]],
    },
})

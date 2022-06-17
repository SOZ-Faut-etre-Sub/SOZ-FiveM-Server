table.insert(migrations, {
    name = "update-luxors",
    queries = {
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'eclipse_towers')
            WHERE identifier IN ('luxor_01','luxor_02','luxor_03');
        ]],
        [[
            DELETE FROM housing_property WHERE identifier IN ('luxor_01','luxor_02','luxor_03');
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'tinsel_towers')
            WHERE identifier = 'soz_appartements_17';
        ]],
        [[
            DELETE FROM housing_property WHERE identifier = 'soz_appartements_17';
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'del_perro_heights')
            WHERE identifier = 'soz_appartements_15';
        ]],
        [[
            DELETE FROM housing_property WHERE identifier = 'soz_appartements_15';
        ]],
    },
})

table.insert(migrations, {
    name = "clean-apartments-zone",
    queries = {
        [[
            UPDATE housing_apartment SET inside_coord = '{"y":6199.10498046875,"x":-464.2026062011719,"w":105.63994598388672,"z":32.63825988769531}' WHERE identifier = 'north_house_mid_01';
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'eclipse_towers')
            WHERE identifier IN ('south_appartements_high_11', 'south_appartements_high_12', 'south_appartements_high_14');
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'tinsel_towers')
            WHERE identifier IN ('south_appartements_high_15', 'south_appartements_high_16');
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'del_perro_heights')
            WHERE identifier IN ('south_appartements_high_17', 'south_appartements_high_18');
        ]],
        [[
            DELETE FROM housing_property
            WHERE identifier IN ('south_appartements_high_11', 'south_appartements_high_12', 'south_appartements_high_14',
                                 'south_appartements_high_15', 'south_appartements_high_16', 'south_appartements_high_17',
                                 'south_appartements_high_18');
        ]],
    },
})

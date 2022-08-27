table.insert(migrations, {
    name = "clean-disabled-housing-issue",
    queries = {
        [[
           drop table player_house;
        ]],
        [[
           update housing_apartment set owner = null, roommate = null where identifier in ('v_trailer_11', 'south_house_low_05', 'south_house_mid_07');
        ]],
        [[
           update housing_apartment set price = 148000 where identifier like 'south_appartements_high_%';
        ]],
        [[
           update housing_apartment set price = 600000 where identifier like 'luxor_%';
        ]],
        [[
           update housing_property set identifier = 'elgin' where identifier = 'elign';
        ]],
        [[
           update player_vehicles set garage = 'property_elgin' where garage = 'property_elign';
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'heritage_way_01')
            WHERE identifier = 'soz_appartements_16';
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'integrity_way')
            WHERE identifier IN ('soz_appartements_19', 'south_appartements_high_01');
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'alta_street')
            WHERE identifier IN ('south_appartements_high_02', 'south_appartements_high_03');
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'san_andreas_02')
            WHERE identifier IN ('south_appartements_high_04', 'south_appartements_high_05');
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'heritage_way_01')
            WHERE identifier IN ('south_appartements_high_07', 'south_appartements_high_09');
        ]],
        [[
            UPDATE housing_apartment SET property_id = (SELECT id FROM housing_property WHERE identifier = 'heritage_way_02')
            WHERE identifier IN ('south_appartements_high_06', 'south_appartements_high_08', 'south_appartements_high_10');
        ]],
        [[
            DELETE FROM housing_property WHERE identifier IN (
                'soz_appartements_16',
                'soz_appartements_19', 'south_appartements_high_01',
                'south_appartements_high_02', 'south_appartements_high_03',
                'south_appartements_high_04', 'south_appartements_high_05',
                'south_appartements_high_07', 'south_appartements_high_09',
                'south_appartements_high_06', 'south_appartements_high_08', 'south_appartements_high_10'
            );
        ]],
    },
})

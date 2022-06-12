table.insert(migrations, {
    name = "clean-apartments-zone",
    queries = {
        [[
            UPDATE housing_apartment SET
            inside_coord = '{"y":6199.10498046875,"x":-464.2026062011719,"w":105.63994598388672,"z":32.63825988769531}',
            exit_zone = '{"y":6199.03,"z":33.64,"maxZ":35.14,"heading":2,"sy":0.4,"minZ":32.64,"x":-463.27,"sx":1.6}',
            WHERE identifier = 'north_house_mid_01';
        ]],
        [[
            UPDATE housing_apartment SET
              inside_coord = '{"y":4028.116943359375,"x":2415.1708984375,"w":112.5787353515625,"z":35.98185729980469}',
              exit_zone = '{"minZ":35.98,"heading":340,"sx":1.4,"z":36.98,"y":4027.98,"x":2415.73,"sy":0.2,"maxZ":38.48}',
              fridge_zone = '{"minZ":35.98,"heading":341,"sx":1,"z":36.98,"y":4030.57,"x":2412.53,"sy":0.8,"maxZ":38.48}',
              stash_zone = '{"minZ":33.18,"heading":341,"sx":1,"z":36.98,"y":4030.1,"x":2414.26,"sy":1.6,"maxZ":37.18}',
              closet_zone = '{"minZ":34.38,"heading":72,"sx":0.89999999999999,"z":36.98,"y":4021.84,"x":2417.1,"sy":1.59999999999999,"maxZ":38.38}',
              money_zone = '{"minZ":32.98,"heading":71,"sx":1.59999999999999,"z":36.98,"y":4021.0,"x":2408.39,"sy":0.2,"maxZ":36.98}'
            WHERE identifier = 'north_house_low_03';
        ]],
        [[
            UPDATE housing_apartment SET
              inside_coord = '{"y":3170.640625,"x":249.90187072753907,"w":290.8441467285156,"z":41.8614273071289}',
              exit_zone = '{"x":249.02,"sx":1.6,"z":42.86,"y":3170.44,"minZ":41.86,"maxZ":44.36,"sy":0.4,"heading":2}',
              fridge_zone = '{"x":250.77,"sx":1,"z":42.86,"y":3172.6,"minZ":39.81,"maxZ":43.81,"sy":1.09999999999999,"heading":3}',
              stash_zone = '{"x":253.54,"sx":0.7,"z":42.86,"y":3164.96,"minZ":38.66,"maxZ":42.66,"sy":1.15,"heading":1}',
              closet_zone = '{"x":259.51,"sx":1.0,"z":42.86,"y":3167.1,"minZ":40.26,"maxZ":44.26,"sy":2.59999999999999,"heading":272}',
              money_zone = '{"x":256.3,"sx":0.6,"z":42.86,"y":3171.7,"minZ":38.46,"maxZ":42.46,"sy":1.2,"heading":3}'
            WHERE identifier = 'north_house_mid_06';
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

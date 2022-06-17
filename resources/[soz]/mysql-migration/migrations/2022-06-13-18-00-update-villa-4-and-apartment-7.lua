table.insert(migrations, {
    name = "update-villa-4-and-apartment-7",
    queries = {
        [[
            UPDATE housing_apartment SET
              inside_coord = '{"x":-713.4878540039063,"w":187.0460662841797,"z":141.90814208984376,"y":585.5389404296875}',
              exit_zone = '{"sx":0.4,"x":-713.38,"maxZ":144.31,"heading":0,"z":142.91,"minZ":140.31,"sy":1.65,"y":586.6}',
              fridge_zone = '{"sx":0.29999999999999,"x":-710.9,"maxZ":144.05,"heading":0,"z":142.9,"minZ":140.05,"sy":1.8,"y":583.59}',
              stash_zone = '{"sx":0.5,"x":-711.78,"maxZ":135.65,"heading":0,"z":135.3,"minZ":131.25,"sy":1.8,"y":591.36}',
              closet_zone = '{"sx":2,"x":-709.74,"maxZ":140.6,"heading":0,"z":139.1,"minZ":138.1,"sy":3.0,"y":574.7}',
              money_zone = '{"sx":0.64999999999999,"x":-709.49,"maxZ":135.5,"heading":0,"z":135.3,"minZ":131.5,"sy":0.7,"y":596.47}'
            WHERE identifier = 'soz_villa_04';
        ]],
        [[
            INSERT INTO housing_property (identifier, entry_zone, garage_zone) VALUES ('eclipse_medical_tower', '{"maxZ":86.33,"z":83.08,"x":-676.78,"minZ":81.93,"sx":0.4,"sy":9.0,"y":314.32,"heading":355}', null);
        ]],
        [[
            UPDATE housing_apartment SET
              property_id = (SELECT id FROM housing_property WHERE identifier = 'eclipse_medical_tower'),
              inside_coord = '{"y":331.846923828125,"z":124.12992858886719,"w":116.48318481445313,"x":-677.3155517578125}',
              exit_zone = '{"sx":1.99999999999999,"minZ":124.13,"heading":356,"sy":0.4,"y":331.24,"z":125.13,"maxZ":126.73,"x":-668.15}',
              fridge_zone = '{"sx":1,"minZ":123.53,"heading":355,"sy":1.99999999999999,"y":321.85,"z":124.53,"maxZ":126.38,"x":-683.39}',
              stash_zone = '{"sx":0.6,"minZ":123.53,"heading":265,"sy":1.8,"y":327.69,"z":124.53,"maxZ":124.93,"x":-686.81}',
              closet_zone = '{"sx":3.6,"minZ":122.93,"heading":355,"sy":4.2,"y":327.64,"z":123.93,"maxZ":125.43,"x":-660.66}',
              money_zone = '{"sx":0.6,"minZ":123.53,"heading":355,"sy":0.7,"y":330.49,"z":124.53,"maxZ":124.73,"x":-691.69}'
            WHERE identifier = 'soz_appartements_07';
        ]],
        [[
            DELETE FROM housing_property WHERE identifier='soz_appartements_07';
        ]],
    },
})

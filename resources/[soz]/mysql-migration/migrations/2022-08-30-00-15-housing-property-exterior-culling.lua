table.insert(migrations, {
    name = "housing-property-exterior-culling",
    queries = {
        [[
           alter table housing_property add exterior_culling longtext default '[]' not null;
        ]],
        [[
          update housing_property set exterior_culling = '[-440174109,-1799920002]' where identifier = 'eclipse_towers';
        ]],
        [[
          update housing_property set exterior_culling = '[-786039918,-1336566342]' where identifier = 'eclipse_medical_tower';
        ]],
    },
})

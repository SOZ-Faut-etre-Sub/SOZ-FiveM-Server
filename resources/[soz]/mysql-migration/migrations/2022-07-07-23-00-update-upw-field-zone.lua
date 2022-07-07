table.insert(migrations, {
    name = "update-upw-field-zone",
    queries = {
        [[
            UPDATE upw_facility
            SET data = JSON_SET(data, '$.zones.wasteZone', JSON_OBJECT(
                'coords', JSON_OBJECT('x', 1967.34, 'y', 553.38, 'z', 161.49),
                'heading', 85,
                'sy', 29.2,
                'sx', 25.4,
                'maxZ', 164.49,
                'minZ', 159.49))
            WHERE type = 'plant' AND identifier = 'hydro1';
        ]],
    },
});

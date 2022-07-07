table.insert(migrations, {
    name = "refresh-upw-plant",
    queries = {
        [[
            DELETE FROM upw_facility WHERE type = 'plant';
        ]],
        [[
            INSERT INTO upw_facility (type, identifier, data) VALUES

            ('plant', 'fossil1', '{"active": true, "capacity": 10000, "maxCapacity": 10000, "productionPerMinute": {"min": 50, "max": 100}, "waste": 0, "maxWaste": 1000, "wastePerMinute": 0, "pollutionPerUnit": 1.0, "zones": {"energyZone": {"coords": {"x": 2812.97, "y": 1468.21, "z": 24.73}, "sx": 0.8, "sy": 1.3, "heading": 345, "minZ": 23.78, "maxZ": 26.18}}}'),

            ('plant', 'hydro1', '{"active": true, "capacity": 10000, "maxCapacity": 10000, "productionPerMinute": {"min": 4, "max": 6}, "waste": 0, "maxWaste": 10000, "wastePerMinute": {"min": 1, "max": 3}, "pollutionPerUnit": 0, "zones": {"energyZone": {"coords": {"x": 1665.76, "y": -1.38, "z": 166.45}, "sx": 3.8, "sy": 1.5, "heading": 300, "minZ": 164.85, "maxZ": 167.65}, "wasteZone": {"coords": {"x": 1915.1, "y": 582.84, "z": 176.66}, "sx": 1.2, "sy": 0.2, "heading": 335, "minZ": 175.46, "maxZ": 177.66}}}'),

            ('plant', 'wind1', '{"active": true, "capacity": 10000, "maxCapacity": 10000, "productionPerMinute": {"min": 1, "max": 10}, "waste": 0, "maxWaste": 1000, "wastePerMinute": 0, "pollutionPerUnit": 0.1, "zones": {"energyZone": {"coords": {"x": 2139.11, "y": 1936.29, "z": 93.69}, "sx": 5.0, "sy": 3.8, "heading": 0, "minZ": 92.89, "maxZ": 96.09}}}');
        ]],
    },
})

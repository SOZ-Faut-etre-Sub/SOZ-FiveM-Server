table.insert(migrations, {
    name = "insert-upw-facilities",
    queries = {
        [[
            DELETE FROM upw_facility;
        ]],
        [[
            INSERT INTO upw_facility (type, identifier, data) VALUES
            ('pollution-manager', 'pm1', '{"currentPollution":0,"units":[],"buffer":[]}'),

            ('plant', 'fossil1', '{"active": false, "capacity": 0, "maxCapacity": 1000, "productionPerMinute": {"min": 1, "max": 2}, "waste": 0, "maxWaste": 1000, "wastePerMinute": 0, "pollutionPerUnit": {"min": 1, "max": 2}, "zones": {"energyZone": {"coords": {"x": 2812.97, "y": 1468.21, "z": 24.73}, "sx": 0.8, "sy": 1.3, "heading": 345, "minZ": 23.78, "maxZ": 26.18}}}'),

            ('plant', 'hydro1', '{"active": false, "capacity": 0, "maxCapacity": 1000, "productionPerMinute": {"min": 1, "max": 2}, "waste": 0, "maxWaste": 1000, "wastePerMinute": {"min": 0, "max": 0}, "pollutionPerUnit": 0, "zones": {"energyZone": {"coords": {"x": 1665.76, "y": -1.38, "z": 166.45}, "sx": 3.8, "sy": 1.5, "heading": 300, "minZ": 164.85, "maxZ": 167.65}, "wasteZone": {"coords": {"x": 1915.1, "y": 582.84, "z": 176.66}, "sx": 1.2, "sy": 0.2, "heading": 335, "minZ": 175.46, "maxZ": 177.66}}}'),

            ('plant', 'wind1', '{"active": false, "capacity": 0, "maxCapacity": 1000, "productionPerMinute": {"min": 1, "max": 2}, "waste": 0, "maxWaste": 1000, "wastePerMinute": 0, "pollutionPerUnit": 0, "zones": {"energyZone": {"coords": {"x": 2139.11, "y": 1936.29, "z": 93.69}, "sx": 5.0, "sy": 3.8, "heading": 0, "minZ": 92.89, "maxZ": 96.09}}}'),

            ('inverter', 'inverter1', '{"capacity": 500, "maxCapacity": 500, "zone": {"coords": {"x": 719.0, "y": 153.03, "z": 81.97}, "sx": 1.4, "sy": 0.4, "heading": 60, "minZ": 79.97, "maxZ": 82.37}}'),

            ('inverter', 'inverter2', '{"capacity": 500, "maxCapacity": 500, "zone": {"coords": {"x": 751.23, "y": -1966.93, "z": 29.05}, "sx": 1.2, "sy": 0.3, "heading": 85, "minZ": 28.45, "maxZ": 30.75}}'),

            ('terminal', 'terminal1', '{"scope": "default", "capacity": 500, "maxCapacity": 500, "zone": {"coords": {"x": 2297.03, "y": 2945.5, "z": 46.58}, "sx": 0.2, "sy": 1.4, "heading": 270, "minZ": 45.78, "maxZ": 48.18}}');
        ]],
    },
})

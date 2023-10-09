-- LS Custom PolyZone Locations
Locations["ls-custom"] = {
    [1] = BoxZone:Create(vector3(-339.46, -136.73, 39.01), 18, 10, {
        name = "ls-custom1",
        heading = 70,
        minZ = 38.0,
        maxZ = 42.01,
        debugPoly = LocationDebugPoly,
    }),
    [2] = BoxZone:Create(vector3(-1154.88, -2005.4, 13.18), 10, 18,
                         {name = "ls-custom2", heading = 45, minZ = 12.18, maxZ = 16.18, debugPoly = LocationDebugPoly}),
    [3] = BoxZone:Create(vector3(731.87, -1087.88, 22.17), 10, 10, {
        name = "ls-custom3",
        heading = 0,
        minZ = 21.17,
        maxZ = 25.17,
        debugPoly = LocationDebugPoly,
    }),
    -- Paleto LSCustom is large to allow Trunk customization
    [4] = BoxZone:Create(vector3(103.78, 6628.37, 31.40), 22.60, 22.80,
                         {name = "ls-custom4", heading = 45, minZ = 30.40, maxZ = 37.00, debugPoly = LocationDebugPoly}),
    [5] = BoxZone:Create(vector3(1175.88, 2640.3, 37.79), 10, 10, {
        name = "ls-custom5",
        heading = 45,
        minZ = 36.79,
        maxZ = 40.79,
        debugPoly = LocationDebugPoly,
    }),
}

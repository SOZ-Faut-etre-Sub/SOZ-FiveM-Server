-- Fueler PolyZone Locations
Locations["fueler_petrol_farm"] = {
    [1] = PolyZone:Create({
        vector2(476.27612304688, 2986.7197265625),
        vector2(483.51190185546, 2926.3686523438),
        vector2(509.33477783204, 2909.2048339844),
        vector2(533.97302246094, 2839.9375),
        vector2(727.41925048828, 2845.6423339844),
        vector2(665.96124267578, 3053.6645507812),
        vector2(588.5396118164, 3042.2253417968),
    }, {name = "fueler_petrol_farm", minZ = 37.55, maxZ = 55.55, debugPoly = LocationDebugPoly}),
}

Locations["fueler_petrol_refinery"] = {
    [1] = BoxZone:Create(vector3(2789.93, 1525.87, 24.51), 22.4, 81.6,
                         {
        name = "fueler_petrol_refinery",
        heading = 75,
        minZ = 23.51,
        maxZ = 26.51,
        debugPoly = LocationDebugPoly,
    }),
}

Locations["fueler_petrol_resell"] = {
    [1] = BoxZone:Create(vector3(267.84, -2982.23, 4.93), 40.2, 37.8,
                         {
        name = "fueler_petrol_resell",
        heading = 0,
        minZ = 2.93,
        maxZ = 8.93,
        debugPoly = LocationDebugPoly,
    }),
}

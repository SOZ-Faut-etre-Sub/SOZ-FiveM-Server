Config = {}

Config.PedCoords = vector4(-813.97, 176.22, 76.74, -7.5) -- Create preview ped at these coordinates

Config.CloakroomUpgrades = {
    [0] = 4,
    [1] = 5,
    [2] = 6,
    [3] = 7,
    [4] = 8,
    [5] = 9,
    [6] = 10,
    [7] = 11,
    [8] = 12,
    [9] = 13,
}

Config.Locations = {
    ["spawn1"] = {
        PlayerCustomization = vector4(-811.82, 175.2, 75.75, 111.82),
        ["Coords"] = {
            ["X"] = -1037.47,
            ["Y"] = -2737.59,
            ["Z"] = 20.17,
            ["XR"] = -40.0,
            ["Z-Offset"] = 15,
            ["H"] = 330.0,
        },
    },
    ["spawn2"] = {
        PlayerCustomization = vector4(-101.15, 6195.74, 30.03, 136.74),
        ["Coords"] = {
            ["X"] = -105.82,
            ["Y"] = 6314.55,
            ["Z"] = 31.49,
            ["XR"] = -85.00,
            ["Z-Offset"] = 15,
            ["H"] = 130.0,
        },
    },
}

Config.NewPlayerDefaultItems = {
    {name = "phone", quantity = 1},
    {name = "welcome_book", quantity = 1},
    {name = "cheese9", quantity = 4},
    {name = "sausage4", quantity = 4},
    {name = "grapejuice2", quantity = 4},
    {name = "grapejuice3", quantity = 2},
    {name = "grapejuice5", quantity = 2},
    {name = "cardbord", quantity = 1},
    {name = "health_book", quantity = 1},
    {name = "politic_book", quantity = 1},
    {name = "full_scarf", quantity = 1},
}

MappingCompomentKeyToReset = {
    ["1"] = "HideMask",
    ["4"] = "HidePants",
    ["5"] = "HideBag",
    ["6"] = "HideShoes",
    ["7"] = "HideChain",
    ["9"] = "HideBulletproof",
    ["11"] = "HideTop",
}

MappingPropKeyToReset = {["0"] = "HideHead", ["1"] = "HideGlasses", ["6"] = "HideLeftHand", ["7"] = "HideRightHand"}

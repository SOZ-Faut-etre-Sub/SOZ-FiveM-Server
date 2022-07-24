BaunConfig = {}

BaunConfig.Blips = {
    {
        Id = "jobs:baun:bahama",
        Name = "Bahama Mamas",
        Icon = 93,
        Color = 4,
        Coords = vector2(-1393.49, -598.06),
        Scale = 1.0,
    },
    {
        Id = "jobs:baun:unicorn",
        Name = "Vanilla Unicorn",
        Icon = 121,
        Color = 62,
        Coords = vector2(127.57, -1288.96),
        Scale = 1.0,
    },
}

BaunConfig.Cloakroom = {
    Zones = {
        {
            center = vector3(106.36, -1299.08, 28.77),
            length = 0.4,
            width = 2.3,
            options = {name = "baun:unicorn:cloakroom1", heading = 30, minZ = 27.82, maxZ = 30.27},
        },
        {
            center = vector3(109.05, -1304.24, 28.77),
            length = 2.25,
            width = 0.4,
            options = {name = "baun:unicorn:cloakroom2", heading = 30, minZ = 27.87, maxZ = 30.27},
        },
    },
    Clothes = {
        [GetHashKey("mp_m_freemode_01")] = {
            ["Tenue Direction"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 4, Texture = 0, Palette = 0},
                    [4] = {Drawable = 50, Texture = 2, Palette = 0},
                    [6] = {Drawable = 10, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 150, Texture = 13, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 292, Texture = 18, Palette = 0},
                },
                Props = {},
            },
        },
        [GetHashKey("mp_f_freemode_01")] = {
            ["Tenue Direction"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 7, Texture = 0, Palette = 0},
                    [4] = {Drawable = 52, Texture = 2, Palette = 0},
                    [6] = {Drawable = 29, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 39, Texture = 10, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 25, Texture = 4, Palette = 0},
                },
                Props = {},
            },
        },
    },
}

BaunConfig.HarvestZones = {
    {
        item = "liquor_crate",
        zones = {
            {
                center = vector3(1409.39, 1147.35, 114.33),
                length = 6.8,
                width = 0.2,
                options = {name = "baun:harvest:liquor", heading = 0, minZ = 113.38, maxZ = 115.58},
            },
        },
    },
    {
        item = "flavor_crate",
        zones = {
            {
                ped = {model = "a_m_m_prolhost_01", coords = vector4(868.5, -1625.73, 30.25, 141.6)},
                center = vector3(869.25, -1629.26, 30.21),
                length = 2.6,
                width = 0.1,
                options = {name = "baun:harvest:flavor:1", heading = 0, minZ = 29.46, maxZ = 31.66},
            },
        },
    },
    {
        item = "furniture_crate",
        zones = {
            {
                ped = {model = "a_f_y_business_02", coords = vector4(45.3, -1750.68, 29.64, 26.92)},
                center = vector3(29.91, -1770.79, 29.57),
                length = 4,
                width = 0.1,
                options = {
                    name = "baun:harvest:furniture:1",
                    heading = 320,
                    minZ = 28.57,
                    maxZ = 32.17
                },
            },
        },
    },
}

BaunConfig.Restock = {
    ["liquor_crate"] = {
        {itemId = "vodka", quantity = 2},
        {itemId = "gin", quantity = 2},
        {itemId = "tequila", quantity = 2},
        {itemId = "whisky", quantity = 2},
        {itemId = "cognac", quantity = 2},
        {itemId = "rhum", quantity = 2},
        {itemId = "champagne", quantity = 2},
    },
    ["flavor_crate"] = {
        {itemId = "green_lemon", quantity = 6},
        {itemId = "cane_sugar", quantity = 6},
        {itemId = "ananas_juice", quantity = 6},
        {itemId = "coconut_milk", quantity = 6},
        {itemId = "cinnamon", quantity = 6},
        {itemId = "strawberry_juice", quantity = 6},
        {itemId = "orange_juice", quantity = 6},
    },
    ["furniture_crate"] = {
        {itemId = "straw", quantity = 10},
        {itemId = "ice_cubes", quantity = 40},
        {itemId = "fruit_slice", quantity = 20},
        {itemId = "tumbler", quantity = 10},
    },
}

BaunConfig.CraftZones = {
    {
        center = vector3(130.19, -1280.92, 29.27),
        length = 0.2,
        width = 0.2,
        options = {name = "baun:unicorn:craft:1", heading = 25, minZ = 29.27, maxZ = 29.67},
    },
    {
        center = vector3(-1392.21, -606.3, 30.32),
        length = 0.2,
        width = 0.2,
        options = {name = "baun:bahama:craft:1", heading = 0, minZ = 30.37, maxZ = 30.77},
    },
    {
        center = vector3(-1377.96, -628.86, 30.82),
        length = 0.2,
        width = 0.2,
        options = {name = "baun:bahama:craft:2", heading = 0, minZ = 30.82, maxZ = 31.22},
    },
}

BaunConfig.Recipes = {
    royal_mojito = {
        {itemId = "rhum", quantity = 1},
        {itemId = "champagne", quantity = 1},
        {itemId = "cane_sugar", quantity = 2},
        {itemId = "green_lemon", quantity = 3},
        {itemId = "ice_cubes", quantity = 8},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
}

BaunConfig.Durations = {
    Crafting = 4000, -- in ms
    Restocking = 4000, -- in ms
    Harvesting = 2000, -- in ms
}

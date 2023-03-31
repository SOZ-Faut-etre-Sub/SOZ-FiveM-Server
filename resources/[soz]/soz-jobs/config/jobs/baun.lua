BaunConfig = {}

BaunConfig.Blips = {
    {Id = "jobs:baun:bahama", Name = "Bahama Unicorn", Icon = 806, Coords = vector2(-1393.49, -598.06), Scale = 1.2},
    {Id = "jobs:baun:unicorn", Name = "Bahama Unicorn", Icon = 806, Coords = vector2(127.57, -1288.96), Scale = 1.2},
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
                center = vector3(868.5, -1625.73, 30.25),
                length = 0.8,
                width = 0.8,
                options = {name = "baun:harvest:flavor:1", heading = 0, minZ = 29.46, maxZ = 31.66},
            },
        },
    },
    {
        item = "furniture_crate",
        zones = {
            {
                ped = {model = "a_f_y_business_02", coords = vector4(45.3, -1750.68, 29.64, 26.92)},
                center = vector3(45.31, -1750.79, 29.58),
                length = 0.8,
                width = 0.8,
                options = {name = "baun:harvest:furniture:1", heading = 320, minZ = 28.58, maxZ = 30.58},
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
    },
    ["flavor_crate"] = {
        {itemId = "green_lemon", quantity = 5},
        {itemId = "cane_sugar", quantity = 10},
        {itemId = "ananas_juice", quantity = 5},
        {itemId = "coconut_milk", quantity = 5},
        -- {itemId = "cinnamon", quantity = 6},
        {itemId = "strawberry_juice", quantity = 5},
        {itemId = "orange_juice", quantity = 5},
        {itemId = "apple_juice", quantity = 5},
    },
    ["furniture_crate"] = {
        {itemId = "straw", quantity = 10},
        {itemId = "ice_cube", quantity = 35},
        {itemId = "fruit_slice", quantity = 12},
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
    narito = {
        {itemId = "rhum", quantity = 1},
        {itemId = "cane_sugar", quantity = 2},
        {itemId = "green_lemon", quantity = 2},
        {itemId = "fruit_slice", quantity = 4},
        {itemId = "ice_cube", quantity = 8},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
    lapicolada = {
        {itemId = "rhum", quantity = 1},
        {itemId = "coconut_milk", quantity = 3},
        {itemId = "ananas_juice", quantity = 2},
        {itemId = "fruit_slice", quantity = 4},
        {itemId = "ice_cube", quantity = 6},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
    sunrayou = {
        {itemId = "tequila", quantity = 1},
        {itemId = "orange_juice", quantity = 1},
        {itemId = "strawberry_juice", quantity = 1},
        {itemId = "fruit_slice", quantity = 4},
        {itemId = "cane_sugar", quantity = 2},
        {itemId = "ice_cube", quantity = 6},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
    ponche = {
        {itemId = "rhum", quantity = 1},
        {itemId = "orange_juice", quantity = 1},
        {itemId = "ananas_juice", quantity = 1},
        {itemId = "cane_sugar", quantity = 2},
        {itemId = "ice_cube", quantity = 4},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
    pinkenny = {
        {itemId = "vodka", quantity = 1},
        {itemId = "green_lemon", quantity = 1},
        {itemId = "strawberry_juice", quantity = 2},
        {itemId = "apple_juice", quantity = 3},
        {itemId = "cane_sugar", quantity = 2},
        {itemId = "ice_cube", quantity = 4},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
    phasmopolitan = {
        {itemId = "gin", quantity = 1},
        {itemId = "green_lemon", quantity = 1},
        {itemId = "ice_cube", quantity = 4},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
    escalier = {
        {itemId = "cognac", quantity = 1},
        {itemId = "orange_juice", quantity = 2},
        {itemId = "ice_cube", quantity = 2},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
    whicanelle = {
        {itemId = "whisky", quantity = 1},
        {itemId = "apple_juice", quantity = 2},
        {itemId = "green_lemon", quantity = 1},
        {itemId = "cane_sugar", quantity = 2},
        {itemId = "ice_cube", quantity = 1},
        {itemId = "straw", quantity = 1},
        {itemId = "tumbler", quantity = 1},
    },
}

BaunConfig.Durations = {
    Crafting = 4000, -- in ms
    Restocking = 4000, -- in ms
    Harvesting = 2000, -- in ms
}

BaunConfig = {}

BaunConfig.Blips = {
    {
        Id = "jobs:baun:bahama",
        Name = "Bahama Mamas",
        Icon = 93,
        Color = 4,
        Coords = vector2(-1393.49, -598.06),
        Scale = 0.9
    },
    {
        Id = "jobs:baun:unicorn",
        Name = "Vanilla Unicorn",
        Icon = 121,
        Color = 28,
        Coords = vector2(127.57, -1288.96),
        Scale = 0.9
    }
}

BaunConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        ["Tenue de patron"] = {
            Components = {
                [1] = { Drawable = 0, Texture = 0, Palette = 0 },
                [3] = { Drawable = 0, Texture = 0, Palette = 0 },
                [4] = { Drawable = 90, Texture = 0, Palette = 0 },
                [6] = { Drawable = 51, Texture = 0, Palette = 0 },
                [7] = { Drawable = 0, Texture = 0, Palette = 0 },
                [8] = { Drawable = 15, Texture = 0, Palette = 0 },
                [9] = { Drawable = 0, Texture = 0, Palette = 0 },
                [10] = { Drawable = 0, Texture = 0, Palette = 0 },
                [11] = { Drawable = 0, Texture = 2, Palette = 0 },
            },
            Props = {},
        },
        ["Tenue de serveur"] = {
            Components = {
                [1] = { Drawable = 0, Texture = 0, Palette = 0 },
                [3] = { Drawable = 14, Texture = 0, Palette = 0 },
                [4] = { Drawable = 35, Texture = 0, Palette = 0 },
                [6] = { Drawable = 20, Texture = 3, Palette = 0 },
                [7] = { Drawable = 0, Texture = 0, Palette = 0 },
                [8] = { Drawable = 25, Texture = 3, Palette = 0 },
                [9] = { Drawable = 0, Texture = 0, Palette = 0 },
                [10] = { Drawable = 0, Texture = 0, Palette = 0 },
                [11] = { Drawable = 4, Texture = 0, Palette = 0 },
            },
            Props = {},
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        ["Tenue de travail"] = {
            Components = {
                [1] = { Drawable = 0, Texture = 0, Palette = 0 },
                [3] = { Drawable = 0, Texture = 0, Palette = 0 },
                [4] = { Drawable = 93, Texture = 0, Palette = 0 },
                [6] = { Drawable = 52, Texture = 0, Palette = 0 },
                [7] = { Drawable = 0, Texture = 0, Palette = 0 },
                [8] = { Drawable = 1, Texture = 0, Palette = 0 },
                [9] = { Drawable = 0, Texture = 0, Palette = 0 },
                [10] = { Drawable = 0, Texture = 0, Palette = 0 },
                [11] = { Drawable = 73, Texture = 1, Palette = 0 },
            },
            Props = {},
        },
        ["Tenue de prestation"] = {
            Components = {
                [1] = { Drawable = 0, Texture = 0, Palette = 0 },
                [3] = { Drawable = 3, Texture = 0, Palette = 0 },
                [4] = { Drawable = 34, Texture = 0, Palette = 0 },
                [6] = { Drawable = 29, Texture = 1, Palette = 0 },
                [7] = { Drawable = 0, Texture = 0, Palette = 0 },
                [8] = { Drawable = 40, Texture = 7, Palette = 0 },
                [9] = { Drawable = 0, Texture = 0, Palette = 0 },
                [10] = { Drawable = 0, Texture = 0, Palette = 0 },
                [11] = { Drawable = 7, Texture = 0, Palette = 0 },
            },
            Props = {},
        },
    },
}

BaunConfig.HarvestZones = {
    {
        name = "baun:harvest:liquor:combo",
        item = 'liquor_crate',
        zones = {
            {
                type = 'box',
                center = vector3(1409.39, 1147.35, 114.33),
                length = 6.8,
                width = 0.2,
                options = {
                    name = "baun:harvest:liquor",
                    heading = 0,
                    minZ = 113.38,
                    maxZ = 115.58,
                    debugPoly = true,
                }
            }
        }
    },
    {
        name = "baun:harvest:flavor:combo",
        item = 'flavor_crate',
        zones = {
            {
                type = 'box',
                center = vector3(869.25, -1629.26, 30.21),
                length = 2.6,
                width = 0.1,
                options = {
                    name = "baun:harvest:flavor",
                    heading = 0,
                    minZ = 29.46,
                    maxZ = 31.66,
                    debugPoly = true,
                }
            }
        }
    },
    {
        name = "baun:harvest:furniture:combo",
        item = 'furniture_crate',
        zones = {
            {
                type = 'box',
                center = vector3(29.91, -1770.79, 29.57),
                length = 4,
                width = 0.1,
                options = {
                    name = "baun:harvest:furniture:1",
                    heading = 320,
                    minZ=28.57,
                    maxZ=32.17,
                    debugPoly = true,
                },
            },
            {
                type = 'box',
                center = vector3(47.21, -1750.2, 29.34),
                length = 4,
                width = 0.1,
                options = {
                    name = "baun:harvest:furniture:2",
                    heading = 320,
                    minZ=28.57,
                    maxZ=32.17,
                    debugPoly = true,
                },
            },
            {
                type = 'box',
                center = vector3(55.89, -1739.88, 29.54),
                length = 4,
                width = 0.1,
                options = {
                    name = "baun:harvest:furniture:3",
                    heading = 320,
                    minZ=28.54,
                    maxZ=32.14,
                    debugPoly = true,
                },
            },
            {
                type = 'box',
                center = vector3(64.55, -1729.55, 29.62),
                length = 4,
                width = 0.1,
                options = {
                    name = "baun:harvest:furniture:4",
                    heading = 320,
                    minZ=28.62,
                    maxZ=32.02,
                    debugPoly = true,
                },
            },
        }
    }
}

BaunConfig.CraftZones = {
    {
        type = 'poly',
        points = {
            vector2(-1387.0349121094, -609.95153808594),
            vector2(-1388.3884277344, -609.40283203125),
            vector2(-1389.6258544922, -608.61895751954),
            vector2(-1390.7501220704, -607.59783935546),
            vector2(-1391.63671875, -606.4857788086),
            vector2(-1392.3319091796, -605.19555664062),
            vector2(-1392.7904052734, -603.7705078125),
            vector2(-1392.853881836, -602.32342529296),
            vector2(-1392.869506836, -601.02783203125),
            vector2(-1389.714477539, -598.8832397461),
            vector2(-1383.8172607422, -607.91186523438)
        },
        options = {
            name = 'bahamas:craft:1',
            minZ = 29.32,
            maxZ = 32.72,
            gridDivisions = 30,
            debugPoly = true
        },
    },
    {
        type = 'box',
        center = vector3(-1376.4, -628.53, 30.82),
        length = 2.8,
        width = 11.2,
        options = {
            name="bahamas:craft:2",
            heading=33,
            debugPoly = true
        },
    }
}

BaunConfig.Recipes = {
    --mojito = {
    --    { itemId = "rhum", quantity = 1 },
    --    { itemId = "kurkakola", quantity = 1},
    --    { itemId = "lemon", quantity = 1},
    --    { itemId = "mint", quantity = 1 },
    --},
    --limonade = {
    --    { itemId = "water_bottle", quantity = 1},
    --    { itemId = "lemon", quantity = 1}
    --}
}

BaunConfig.Durations = {
    Crafting = 5000, -- in ms
    Harvesting = 2000, -- in ms
}

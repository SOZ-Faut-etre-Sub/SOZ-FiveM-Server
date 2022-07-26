FuelerConfig = {}

FuelerConfig.SellPrice = 3

FuelerConfig.Fields = {
    ["petrol1"] = {
        prodRange = {min = 500, max = 700},
        refillDelay = 30000, -- in ms
        item = "petroleum",
        zone = {
            vector3(476.27612304688, 2986.7197265625, 37.55),
            vector3(483.51190185546, 2926.3686523438, 37.55),
            vector3(509.33477783204, 2909.2048339844, 37.55),
            vector3(533.97302246094, 2839.9375, 37.55),
            vector3(727.41925048828, 2845.6423339844, 55.55),
            vector3(665.96124267578, 3053.6645507812, 55.55),
            vector3(588.5396118164, 3042.2253417968, 55.55),
        },
    },
    ["petrol2"] = {
        prodRange = {min = 500, max = 700},
        refillDelay = 30000, -- in ms
        item = "petroleum",
        zone = {
            vector3(1343.3212890625, -2243.3898925782, 61.48),
            vector3(1356.2628173828, -2298.9008789062, 61.48),
            vector3(1366.0158691406, -2353.48828125, 61.48),
            vector3(1419.2153320312, -2345.9350585938, 61.48),
            vector3(1462.712524414, -2347.0263671875, 61.48),
            vector3(1452.5794677734, -2307.3266601562, 61.48),
            vector3(1489.618774414, -2279.5280761718, 71.95),
            vector3(1496.968383789, -2250.1540527344, 71.95),
            vector3(1450.2510986328, -2238.0737304688, 71.95),
            vector3(1385.1121826172, -2235.2758789062, 71.95)
        },
    },
}

FuelerConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        ["Tenue de travail d'hiver"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 1, Texture = 0, Palette = 0},
                [4] = {Drawable = 98, Texture = 16, Palette = 0},
                [6] = {Drawable = 82, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 2, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 244, Texture = 18, Palette = 0},
            },
            Props = {},
        },
        ["Tenue Direction"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 4, Texture = 0, Palette = 0},
                [4] = {Drawable = 129, Texture = 4, Palette = 0},
                [6] = {Drawable = 20, Texture = 3, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 0, Texture = 20, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 139, Texture = 3, Palette = 0},
            },
            Props = {},
        },
        ["Tenue de travail d'été"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 0, Texture = 0, Palette = 0},
                [4] = {Drawable = 98, Texture = 16, Palette = 0},
                [6] = {Drawable = 82, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 15, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 146, Texture = 7, Palette = 0},
            },
            Props = {},
        },
        ["Tenue Formateur"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 0, Texture = 0, Palette = 0},
                [4] = {Drawable = 98, Texture = 16, Palette = 0},
                [6] = {Drawable = 82, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 15, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 248, Texture = 14, Palette = 0},
            },
            Props = {},
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        ["Tenue de travail d'hiver"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 1, Texture = 0, Palette = 0},
                [4] = {Drawable = 101, Texture = 16, Palette = 0},
                [6] = {Drawable = 25, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 0, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 259, Texture = 16, Palette = 0},
            },
            Props = {},
        },
        ["Tenue Direction"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 3, Texture = 0, Palette = 0},
                [4] = {Drawable = 37, Texture = 5, Palette = 0},
                [6] = {Drawable = 29, Texture = 1, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 0, Texture = 20, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 103, Texture = 3, Palette = 0},
            },
            Props = {},
        },
        ["Tenue de travail d'été"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 14, Texture = 0, Palette = 0},
                [4] = {Drawable = 101, Texture = 16, Palette = 0},
                [6] = {Drawable = 25, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 15, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 141, Texture = 2, Palette = 0},
            },
            Props = {},
        },
        ["Tenue Formateur"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 0, Texture = 0, Palette = 0},
                [4] = {Drawable = 101, Texture = 16, Palette = 0},
                [6] = {Drawable = 25, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 15, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 256, Texture = 14, Palette = 0},
            },
            Props = {},
        },
    },
}

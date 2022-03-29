Config = {}

Config.AllowedJobInteraction = {"lsmc"}

Config.DeathTime = 900

Config.Locations = {
    ["lit"] = {
        [1] = {coords = vector3(312.84, -1433.25, 32.07), used = false},
        [2] = {coords = vector3(315.47, -1435.46, 32.07), used = false},
        [3] = {coords = vector3(318.02, -1437.59, 32.07), used = false},
        [4] = {coords = vector3(320.61, -1439.77, 32.07), used = false},
        [5] = {coords = vector3(325.71, -1444.05, 32.07), used = false},
        [7] = {coords = vector3(328.38, -1446.29, 32.07), used = false},
    },
}

Config.Cloakroom = {
    ["lsmc"] = {
        [GetHashKey("mp_m_freemode_01")] = {
            ["Tenue de service"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 101, Texture = 0, Palette = 0},
                    [4] = {Drawable = 3, Texture = 7, Palette = 0},
                    [5] = {Drawable = 52, Texture = 0, Palette = 0},
                    [6] = {Drawable = 51, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 56, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 190, Texture = 0, Palette = 0},
                },
                Props = {},
            },
        },
        [GetHashKey("mp_f_freemode_01")] = {
            ["Tenue de service"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 101, Texture = 0, Palette = 0},
                    [4] = {Drawable = 3, Texture = 0, Palette = 0},
                    [5] = {Drawable = 0, Texture = 0, Palette = 0},
                    [6] = {Drawable = 3, Texture = 2, Palette = 0},
                    [7] = {Drawable = 22, Texture = 0, Palette = 0},
                    [8] = {Drawable = 189, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 327, Texture = 7, Palette = 0},
                },
                Props = {},
            },
        },
    },
}

Config.Fines = {
    [1] = {
        label = "Factures basique",
        items = {
            {label = "Bandage", price = 3000},
            {label = "Premier secours", price = 4000},
            {label = "Réanimation", price = 8000},
        },
    },
}

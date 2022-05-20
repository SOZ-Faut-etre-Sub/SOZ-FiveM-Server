Config = {}

Config.AllowedJobInteraction = {"lsmc"}

Config.DeathTime = 900

Config.ConditionType = {NoRun = "NoRun", NoHair = "NoHair"}

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
            ["Tenue incendie"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 96, Texture = 0, Palette = 0},
                    [4] = {Drawable = 120, Texture = 0, Palette = 0},
                    [6] = {Drawable = 24, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 151, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 16, Texture = 0, Palette = 0},
                    [11] = {Drawable = 314, Texture = 0, Palette = 0},
                },
                Props = {[0] = {Drawable = 45, Texture = 0, Palette = 0}},
            },
            ["Tenue hazmat"] = {
                Components = {
                    [1] = {Drawable = 46, Texture = 0, Palette = 0},
                    [3] = {Drawable = 86, Texture = 0, Palette = 0},
                    [4] = {Drawable = 40, Texture = 2, Palette = 0},
                    [5] = {Drawable = 0, Texture = 0, Palette = 0},
                    [6] = {Drawable = 25, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 62, Texture = 2, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 67, Texture = 2, Palette = 0},
                },
                Props = {},
            },
        },
        [GetHashKey("mp_f_freemode_01")] = {
            ["Tenue incendie"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 111, Texture = 0, Palette = 0},
                    [4] = {Drawable = 126, Texture = 0, Palette = 0},
                    [6] = {Drawable = 24, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 187, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 15, Texture = 0, Palette = 0},
                    [11] = {Drawable = 325, Texture = 0, Palette = 0},
                },
                Props = {[0] = {Drawable = 44, Texture = 0, Palette = 0}},
            },
            ["Tenue hazmat"] = {
                Components = {
                    [1] = {Drawable = 46, Texture = 0, Palette = 0},
                    [3] = {Drawable = 101, Texture = 0, Palette = 0},
                    [4] = {Drawable = 40, Texture = 2, Palette = 0},
                    [5] = {Drawable = 0, Texture = 0, Palette = 0},
                    [6] = {Drawable = 25, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 43, Texture = 2, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 61, Texture = 2, Palette = 0},
                },
                Props = {},
            },
        },
    },
}

Config.DutyOutfit = {
    ["lsmc"] = {
        [0] = {
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 92, Texture = 0, Palette = 0},
                    [4] = {Drawable = 101, Texture = 0, Palette = 0},
                    [6] = {Drawable = 51, Texture = 0, Palette = 0},
                    [7] = {Drawable = 30, Texture = 0, Palette = 0},
                    [8] = {Drawable = 54, Texture = 0, Palette = 0},
                    [9] = {Drawable = 29, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 213, Texture = 6, Palette = 0},
                },
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 106, Texture = 0, Palette = 0},
                    [4] = {Drawable = 105, Texture = 0, Palette = 0},
                    [6] = {Drawable = 52, Texture = 0, Palette = 0},
                    [7] = {Drawable = 14, Texture = 0, Palette = 0},
                    [8] = {Drawable = 6, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 219, Texture = 6, Palette = 0},
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

Config.BossShop = {
    ["lsmc"] = {
        [1] = {name = "outfit", metadata = {label = "LSMC", type = "lsmc"}, price = 100, amount = 1},
        [2] = {name = "armor", metadata = {label = "LSMC", type = "lsmc"}, price = 150, amount = 1},
        [3] = {name = "antibiotic", metadata = {}, price = 15, amount = 1},
        [4] = {name = "painkiller", metadata = {}, price = 15, amount = 1},
        [5] = {name = "defibrillator", metadata = {}, price = 25, amount = 1},
        [6] = {name = "empty_bloodbag", metadata = {}, price = 5, amount = 1},
        [7] = {name = "firstaid", metadata = {}, price = 10, amount = 1},
        [8] = {name = "pommade", metadata = {}, price = 15, amount = 1},
        [9] = {name = "tissue", metadata = {}, price = 5, amount = 1},
    },
}

QBCore = exports["qb-core"]:GetCoreObject()

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
                Props = {[0] = {Clear = true}},
            },
            ["Tenue Hiver"] = {
                Components = {
                    [3] = {Drawable = 92, Texture = 0, Palette = 0},
                    [4] = {Drawable = 101, Texture = 0, Palette = 0},
                    [6] = {Drawable = 51, Texture = 0, Palette = 0},
                    [7] = {Drawable = 30, Texture = 0, Palette = 0},
                    [8] = {Drawable = 46, Texture = 0, Palette = 0},
                    [9] = {Drawable = 29, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 415, Texture = 0, Palette = 0},
                },
                Props = {},
            },
        },
        [GetHashKey("mp_f_freemode_01")] = {
            ["Tenue incendie"] = {
                Components = {
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
                Props = {[0] = {Clear = true}},
            },
            ["Tenue Hiver"] = {
                Components = {
                    [3] = {Drawable = 106, Texture = 0, Palette = 0},
                    [4] = {Drawable = 105, Texture = 0, Palette = 0},
                    [6] = {Drawable = 52, Texture = 0, Palette = 0},
                    [7] = {Drawable = 14, Texture = 0, Palette = 0},
                    [8] = {Drawable = 39, Texture = 3, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 442, Texture = 0, Palette = 0},
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
                    [3] = {Drawable = 106, Texture = 0, Palette = 0},
                    [4] = {Drawable = 105, Texture = 0, Palette = 0},
                    [6] = {Drawable = 52, Texture = 0, Palette = 0},
                    [7] = {Drawable = 14, Texture = 0, Palette = 0},
                    [8] = {Drawable = 6, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 217, Texture = 6, Palette = 0},
                },
                Props = {},
            },
        },
    },
}

Config.PatientClothes = {
    [GetHashKey("mp_m_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 15, Texture = 0, Palette = 0},
            [4] = {Drawable = 29, Texture = 0, Palette = 0},
            [5] = {Drawable = 0, Texture = 0, Palette = 0},
            [6] = {Drawable = 34, Texture = 0, Palette = 0},
            [7] = {Drawable = 0, Texture = 0, Palette = 0},
            [8] = {Drawable = 15, Texture = 0, Palette = 0},
            [9] = {Drawable = 0, Texture = 0, Palette = 0},
            [10] = {Drawable = 0, Texture = 0, Palette = 0},
            [11] = {Drawable = 104, Texture = 0, Palette = 0},
        },
        Props = {
            [0] = {Clear = true},
            [1] = {Clear = true},
            [2] = {Clear = true},
            [6] = {Clear = true},
            [7] = {Clear = true},
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 0, Texture = 0, Palette = 0},
            [4] = {Drawable = 21, Texture = 0, Palette = 0},
            [6] = {Drawable = 35, Texture = 0, Palette = 0},
            [5] = {Drawable = 0, Texture = 0, Palette = 0},
            [7] = {Drawable = 0, Texture = 0, Palette = 0},
            [8] = {Drawable = 14, Texture = 0, Palette = 0},
            [9] = {Drawable = 0, Texture = 0, Palette = 0},
            [10] = {Drawable = 0, Texture = 0, Palette = 0},
            [11] = {Drawable = 95, Texture = 0, Palette = 0},
        },
        Props = {
            [0] = {Clear = true},
            [1] = {Clear = true},
            [2] = {Clear = true},
            [6] = {Clear = true},
            [7] = {Clear = true},
        },
    },
}

Config.DiseaseRange = {
    [QBCore.Shared.Pollution.Level.Low] = 2000,
    [QBCore.Shared.Pollution.Level.Neutral] = 1000,
    [QBCore.Shared.Pollution.Level.High] = 500,
}

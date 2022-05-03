StonkConfig = {}

StonkConfig.Collection = {
    Cooldown = 900000, -- in ms
    Duration = 5000, -- in ms
    Range = {min = 5, max = 8},
    BagItem = "moneybag",
}

StonkConfig.Resale = {
    TargetEntities = {-2018598162, -735318549},
    Quantity = 5,
    Duration = 5000, -- in ms
    Price = 100,
}

StonkConfig.FillIn = {
    Duration = 3000, -- in ms
    Amount = 1000,
}

StonkConfig.Blip = {Name = "STONK Depository", Icon = 605, Coords = vector2(6.25, -709.11), Scale = 1.0}

StonkConfig.Accounts = {FarmAccount = "farm_stonk", SafeStorage = "safe_cash-transfer"}

StonkConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        ["Tenue de service"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 4, Texture = 0, Palette = 0},
                [4] = {Drawable = 25, Texture = 3, Palette = 0},
                [5] = {Drawable = 0, Texture = 0, Palette = 0},
                [6] = {Drawable = 54, Texture = 0, Palette = 0},
                [7] = {Drawable = 8, Texture = 0, Palette = 0},
                [8] = {Drawable = 20, Texture = 3, Palette = 0},
                [9] = {Drawable = 2, Texture = 0, Palette = 0},
                [10] = {Drawable = 73, Texture = 0, Palette = 0},
                [11] = {Drawable = 214, Texture = 1, Palette = 0},
            },
            Props = {[0] = {Drawable = 10, Texture = 2, Palette = 0}},
        },
        ["Tenue VIP"] = {
            Components = {
                [1] = {Drawable = 121, Texture = 0, Palette = 0},
                [3] = {Drawable = 4, Texture = 0, Palette = 0},
                [4] = {Drawable = 10, Texture = 0, Palette = 0},
                [5] = {Drawable = 0, Texture = 0, Palette = 0},
                [6] = {Drawable = 10, Texture = 0, Palette = 0},
                [7] = {Drawable = 38, Texture = 0, Palette = 0},
                [8] = {Drawable = 178, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 10, Texture = 0, Palette = 0},
            },
            Props = {},
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        ["Tenue de service"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 3, Texture = 0, Palette = 0},
                [4] = {Drawable = 3, Texture = 15, Palette = 0},
                [5] = {Drawable = 0, Texture = 0, Palette = 0},
                [6] = {Drawable = 55, Texture = 0, Palette = 0},
                [7] = {Drawable = 8, Texture = 0, Palette = 0},
                [8] = {Drawable = 19, Texture = 3, Palette = 0},
                [9] = {Drawable = 2, Texture = 0, Palette = 0},
                [10] = {Drawable = 82, Texture = 0, Palette = 0},
                [11] = {Drawable = 218, Texture = 1, Palette = 0},
            },
            Props = {[0] = {Drawable = 10, Texture = 2, Palette = 0}},
        },
        ["Tenue VIP"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 3, Texture = 0, Palette = 0},
                [4] = {Drawable = 150, Texture = 0, Palette = 0},
                [5] = {Drawable = 0, Texture = 0, Palette = 0},
                [6] = {Drawable = 0, Texture = 0, Palette = 0},
                [7] = {Drawable = 8, Texture = 0, Palette = 0},
                [8] = {Drawable = 38, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 306, Texture = 0, Palette = 0},
            },
            Props = {},
        },
    },
}

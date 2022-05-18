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

StonkConfig.DutyOutfit = {
    [GetHashKey("mp_m_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 4, Texture = 0, Palette = 0},
            [4] = {Drawable = 25, Texture = 3, Palette = 0},
            [6] = {Drawable = 54, Texture = 0, Palette = 0},
            [7] = {Drawable = 8, Texture = 0, Palette = 0},
            [8] = {Drawable = 20, Texture = 3, Palette = 0},
            [9] = {Drawable = 0, Texture = 0, Palette = 0},
            [10] = {Drawable = 73, Texture = 0, Palette = 0},
            [11] = {Drawable = 214, Texture = 1, Palette = 0},
        },
        Props = {[0] = {Drawable = 10, Texture = 2, Palette = 0}},
    },
    [GetHashKey("mp_f_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 3, Texture = 0, Palette = 0},
            [4] = {Drawable = 3, Texture = 15, Palette = 0},
            [6] = {Drawable = 55, Texture = 0, Palette = 0},
            [7] = {Drawable = 8, Texture = 0, Palette = 0},
            [8] = {Drawable = 19, Texture = 3, Palette = 0},
            [9] = {Drawable = 0, Texture = 0, Palette = 0},
            [10] = {Drawable = 82, Texture = 0, Palette = 0},
            [11] = {Drawable = 218, Texture = 1, Palette = 0},
        },
        Props = {[0] = {Drawable = 10, Texture = 2, Palette = 0}},
    },
}

StonkConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        ["Tenue VIP"] = {
            Components = {
                [1] = {Drawable = 121, Texture = 0, Palette = 0},
                [3] = {Drawable = 4, Texture = 0, Palette = 0},
                [4] = {Drawable = 10, Texture = 0, Palette = 0},
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
        ["Tenue VIP"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 3, Texture = 0, Palette = 0},
                [4] = {Drawable = 150, Texture = 0, Palette = 0},
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

StonkConfig.BossShop = {
    [1] = {name = "outfit", metadata = {label = "STONK", type = "stonk"}, price = 100, amount = 1},
    [2] = {name = "armor", metadata = {label = "STONK", type = "stonk"}, price = 150, amount = 1},
    [3] = {name = "weapon_pistol", metadata = {}, price = 300, amount = 1},
    [4] = {name = "pistol_ammo", metadata = {}, price = 10, amount = 1},
}

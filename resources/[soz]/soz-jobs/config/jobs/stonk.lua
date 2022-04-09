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

StonkConfig.Blip = {Name = "Stonk Depository", Icon = 605, Color = 24, Coords = vector2(6.25, -709.11), Scale = 0.8}

StonkConfig.Accounts = {FarmAccount = "farm_stonk", SafeStorage = "safe_cash-transfer"}

StonkConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 11, Texture = 0, Palette = 0},
            [4] = {Drawable = 122, Texture = 0, Palette = 0},
            [5] = {Drawable = 0, Texture = 0, Palette = 0},
            [6] = {Drawable = 25, Texture = 0, Palette = 0},
            [7] = {Drawable = 0, Texture = 0, Palette = 0},
            [8] = {Drawable = 14, Texture = 0, Palette = 0},
            [9] = {Drawable = 22, Texture = 0, Palette = 0},
            [10] = {Drawable = 0, Texture = 0, Palette = 0},
            [11] = {Drawable = 348, Texture = 0, Palette = 0},
        },
        Props = {},
    },
    [GetHashKey("mp_f_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 9, Texture = 0, Palette = 0},
            [4] = {Drawable = 129, Texture = 0, Palette = 0},
            [5] = {Drawable = 0, Texture = 0, Palette = 0},
            [6] = {Drawable = 25, Texture = 0, Palette = 0},
            [7] = {Drawable = 0, Texture = 0, Palette = 0},
            [8] = {Drawable = 2, Texture = 0, Palette = 0},
            [9] = {Drawable = 30, Texture = 0, Palette = 0},
            [10] = {Drawable = 0, Texture = 0, Palette = 0},
            [11] = {Drawable = 366, Texture = 0, Palette = 0},
        },
        Props = {},
    },
}

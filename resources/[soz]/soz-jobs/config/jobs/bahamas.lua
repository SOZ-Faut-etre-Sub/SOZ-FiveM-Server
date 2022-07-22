BahamasConfig = {}

BahamasConfig.Blip = {
    Name = "Bahamas Mamas",
    Icon = 93,
    Color = 4,
    Coords = vector2(-1393.49, -598.06),
    Scale = 0.9
}

BahamasConfig.Cloakroom = {
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

BahamasConfig.Zones = {}

BahamasConfig.Recipes = {
    mojito = {
        { itemId = "rhum", quantity = 1 },
        { itemId = "kurkakola", quantity = 1},
        { itemId = "lemon", quantity = 1},
        { itemId = "mint", quantity = 1 },
    },
    limonade = {
        { itemId = "water_bottle", quantity = 1},
        { itemId = "lemon", quantity = 1}
    }
}

BahamasConfig.Durations = {
    Crafting = 5000, -- in ms
    Harvesting = 3000, -- in ms
}

FoodConfig = {}

FoodConfig.Blip = {Name = "Château Marius", Icon = 176, Coords = vector2(-1889.54, 2045.27), Scale = 1.0}

FoodConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {Components = {}, Props = {}},
    [GetHashKey("mp_f_freemode_01")] = {Components = {}, Props = {}},
}

FoodConfig.Collect = {
    Duration = 15000, -- in ms
    Range = {min = 1, max = 3},
    Items = {"grape"},
}

FoodConfig.Categories = {
    ["alcohol"] = {icon = "🍾", label = "Boissons alcolisées"},
    ["softdrink"] = {icon = "🥤", label = "Boissons non alcolisées"},
}

FoodConfig.Recipes = {
    -- ALCOHOL
    ["wine"] = {category = "alcohol", icon = "🍷", ingredients = {["grape"] = 3}},
    -- SOFT DRINKS
    ["grapejuice"] = {category = "softdrink", icon = "🧃", ingredients = {["grape"] = 2}},
}

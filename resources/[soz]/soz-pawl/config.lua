Config = {}

Config.Blip = {
    Name = "Pipe And Wooden Leg",
    Coords = vector2(-574.68, 5332.84),
    Sprite = 607,
    Scale = 1.0,
    Fields = {
        {Coords = vector3(-573.26, 6242.43, 10.11), Radius = 70.0},
        {Coords = vector3(-1525.97, 4721.1, 553.18), Radius = 200.0},
        {Coords = vector3(-866.77, 1928.964, 150.5528), Radius = 200.0},
        {Coords = vector3(545.7898, 4193.535, 42.58311), Radius = 150.0},
        {Coords = vector3(-938.01, 2574.81, 77.93), Radius = 150.0},
    },
}

Config.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        ["Tenue Bucheron"] = {
            Components = {
                [1] = {Palette = 0, Texture = 0, Drawable = 0},
                [3] = {Palette = 0, Texture = 4, Drawable = 145},
                [4] = {Palette = 0, Texture = 8, Drawable = 90},
                [6] = {Palette = 0, Texture = 0, Drawable = 81},
                [7] = {Palette = 0, Texture = 0, Drawable = 0},
                [8] = {Palette = 0, Texture = 0, Drawable = 18},
                [9] = {Palette = 0, Texture = 0, Drawable = 0},
                [10] = {Palette = 0, Texture = 0, Drawable = 0},
                [11] = {Palette = 0, Texture = 19, Drawable = 234},
            },
            Props = {},
        },
        ["Chef Bucheron"] = {
            Components = {
                [1] = {Palette = 0, Texture = 0, Drawable = 0},
                [3] = {Palette = 0, Texture = 4, Drawable = 145},
                [4] = {Palette = 0, Texture = 3, Drawable = 98},
                [6] = {Palette = 0, Texture = 0, Drawable = 81},
                [7] = {Palette = 0, Texture = 0, Drawable = 0},
                [8] = {Palette = 0, Texture = 0, Drawable = 18},
                [9] = {Palette = 0, Texture = 0, Drawable = 0},
                [10] = {Palette = 0, Texture = 0, Drawable = 0},
                [11] = {Palette = 0, Texture = 19, Drawable = 234},
            },
            Props = {},
        },
        ["Tenue d'hiver"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 145, Texture = 4, Palette = 0},
                [4] = {Drawable = 97, Texture = 2, Palette = 0},
                [6] = {Drawable = 70, Texture = 2, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 15, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 251, Texture = 2, Palette = 0},
            },
            Props = {},
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        ["Tenue Bucheron"] = {
            Components = {
                [1] = {Texture = 0, Drawable = 0, Palette = 0},
                [3] = {Texture = 4, Drawable = 179, Palette = 0},
                [4] = {Texture = 8, Drawable = 93, Palette = 0},
                [6] = {Texture = 0, Drawable = 86, Palette = 0},
                [7] = {Texture = 0, Drawable = 0, Palette = 0},
                [8] = {Texture = 20, Drawable = 0, Palette = 0},
                [9] = {Texture = 0, Drawable = 0, Palette = 0},
                [10] = {Texture = 0, Drawable = 0, Palette = 0},
                [11] = {Texture = 19, Drawable = 244, Palette = 0},
            },
            Props = {},
        },
        ["Chef Bucheron"] = {
            Components = {
                [1] = {Texture = 0, Drawable = 0, Palette = 0},
                [3] = {Texture = 4, Drawable = 179, Palette = 0},
                [4] = {Texture = 3, Drawable = 101, Palette = 0},
                [6] = {Texture = 0, Drawable = 86, Palette = 0},
                [7] = {Texture = 0, Drawable = 0, Palette = 0},
                [8] = {Texture = 20, Drawable = 2, Palette = 0},
                [9] = {Texture = 0, Drawable = 0, Palette = 0},
                [10] = {Texture = 0, Drawable = 0, Palette = 0},
                [11] = {Texture = 19, Drawable = 244, Palette = 0},
            },
            Props = {},
        },
        ["Tenue d'hiver"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 179, Texture = 4, Palette = 0},
                [4] = {Drawable = 100, Texture = 2, Palette = 0},
                [6] = {Drawable = 73, Texture = 2, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 15, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 259, Texture = 2, Palette = 0},
            },
            Props = {},
        },
    },
}

Config.Harvest = {
    Duration = 30000,
    SapDuration = 8000,
    RequiredWeapon = "weapon_hatchet",
    RewardItems = {{name = "tree_trunk", amount = 1}},
    SecondaryRewardItems = {{name = "sap", amount = 20}},
}

Config.Processing = {
    Duration = 300000,
    ProcessingStorage = "pawl_log_processing",
    ProcessingItem = "tree_trunk",
    ProcessingAmount = 1,
    PlankStorage = "pawl_plank_storage",
    PlankItem = "wood_plank",
    PlankAmount = 10,
    SawdustStorage = "pawl_sawdust_storage",
    SawdustItem = "sawdust",
    SawdustAmount = 20,
}

Config.CraftDuration = 15000
Config.Craft = {
    ["police_barrier"] = {
        Name = "Barrière de circulation",
        SourceItem = "wood_plank",
        RewardItem = "police_barrier",
        RewardAmount = 1,
    },
    ["paper"] = {Name = "Feuilles de papier", SourceItem = "wood_plank", RewardItem = "paper", RewardAmount = 10},
    ["cabinet_zkea"] = {
        Name = "Meuble ZKEA",
        SourceItem = "wood_plank",
        SourceItemAmount = 2,
        RewardItem = "cabinet_zkea",
        RewardTier = {
            [1] = {Id = 4, Name = "Divin", Chance = GetConvarInt("soz_pawl_craft_chance_tier_4", 25)},
            [2] = {Id = 3, Name = "Sublime", Chance = GetConvarInt("soz_pawl_craft_chance_tier_3", 25)},
            [3] = {Id = 2, Name = "Joli", Chance = GetConvarInt("soz_pawl_craft_chance_tier_2", 25)},
            [4] = {Id = 1, Name = "Banal", Chance = GetConvarInt("soz_pawl_craft_chance_tier_1", 25)},
        },
        RewardAmount = 1,
    },
}

Config.Degradation = {}
Config.Degradation.Tick = 60 * 1000
Config.Degradation.Level = {Green = 0, Yellow = 1, Red = 2}
Config.Degradation.Threshold = {
    [29] = Config.Degradation.Level.Green,
    [59] = Config.Degradation.Level.Yellow,
    [100] = Config.Degradation.Level.Red,
}
Config.Degradation.Multiplier = {
    [Config.Degradation.Level.Green] = 100,
    [Config.Degradation.Level.Yellow] = 50,
    [Config.Degradation.Level.Red] = 10,
}
Config.Degradation.Peds = {
    [GetHashKey("a_c_boar")] = true,
    [GetHashKey("a_c_chickenhawk")] = true,
    [GetHashKey("a_c_cormorant")] = true,
    [GetHashKey("a_c_cow")] = true,
    [GetHashKey("a_c_coyote")] = true,
    [GetHashKey("a_c_crow")] = true,
    [GetHashKey("a_c_deer")] = true,
    [GetHashKey("a_c_hen")] = true,
    [GetHashKey("a_c_pig")] = true,
    [GetHashKey("a_c_pigeon")] = true,
    [GetHashKey("a_c_rabbit_01")] = true,
    [GetHashKey("a_c_seagull")] = true,
}

Config.Field = {
    List = {
        ["paleto_cove"] = {},
        ["great_chaparral"] = {},
        ["raton_canyon"] = {},
        ["alamo_sea"] = {},
        ["chaparral"] = {},
    },
    Sap = {
        ["paleto_cove"] = {},
        ["great_chaparral"] = {},
        ["raton_canyon"] = {},
        ["alamo_sea"] = {},
        ["chaparral"] = {},
    },
    Capacity = 5,
    RefillDelay = 4 * 60 * 60 * 1000,
}

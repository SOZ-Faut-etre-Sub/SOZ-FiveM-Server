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

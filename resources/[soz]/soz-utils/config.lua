Config = {}
Config.MaxWidth = 5.0
Config.MaxHeight = 5.0
Config.MaxLength = 5.0
Config.DamageNeeded = 100.0
Config.EnableProne = true
Config.JointEffectTime = 60
Config.RemoveWeaponDrops = true
Config.RemoveWeaponDropsTimer = 25

ConsumablesDrug = {
    ["joint"] = math.random(20, 30),
    ["crack_baggy"] = math.random(30, 50),
    ["cokebaggy"] = math.random(30, 50),
    ["xtcbaggy"] = math.random(30, 50),
    ["meth"] = math.random(30, 50),
}

ConsumablesExpiredEat = 5
ConsumablesExpiredDrink = 5

Config.BlacklistedScenarios = {
    ["TYPES"] = {
        --[[ "WORLD_VEHICLE_MILITARY_PLANES_SMALL",
        "WORLD_VEHICLE_MILITARY_PLANES_BIG",
        "WORLD_VEHICLE_AMBULANCE",
        "WORLD_VEHICLE_POLICE_NEXT_TO_CAR",
        "WORLD_VEHICLE_POLICE_CAR",
        "WORLD_VEHICLE_POLICE_BIKE",]]
    },
    ["GROUPS"] = { --[[ 2017590552, 2141866469, 1409640232, GetHashKey("ng_planes")]] },
}

Config.BlacklistedPeds = {
    [GetHashKey("s_m_y_ranger_01")] = true,
    [GetHashKey("s_m_y_sheriff_01")] = true,
    [GetHashKey("s_m_y_cop_01")] = true,
    [GetHashKey("s_f_y_sheriff_01")] = true,
    [GetHashKey("s_f_y_cop_01")] = true,
    [GetHashKey("s_m_y_hwaycop_01")] = true,
}

Config.SeatChairOffset = {
    [444105316] = {z = 0.5},
    [1037469683] = {z = 0.4},
    [-109356459] = {z = 0.5},
    [49088219] = {z = 0.5, y = 0.4},
    [-1173315865] = {z = 0.5},
    [536071214] = {z = 0.5},
    [603897027] = {z = 0.4},
    [GetHashKey("soz_v_club_bahbarstool")] = {x = -0.1, z = 0.35},
    [GetHashKey("soz_v_club_baham_bckt_chr")] = {z = 0.1},
}

Config.Teleports = {}

Config.DisableSpawn = {
    { --- LSPD
        [1] = vector2(487.64, -12.38),
        [2] = vector2(531.07, 38.07),
        [3] = vector2(667.54, 1.78),
        [4] = vector2(557.58, -66.67),
    },
    { --- BCSO
        [1] = vector2(1870.77, 3687.37),
        [2] = vector2(1858.87, 3711.39),
        [3] = vector2(1807.03, 3679.45),
        [4] = vector2(1819.46, 3659.77),
    },
    { --- MTP
        [1] = vector2(-316.55, 6034.77),
        [2] = vector2(-286.99, 6005.98),
        [3] = vector2(-192.62, 6099.07),
        [4] = vector2(-224.23, 6129.52),
    },
    { --- PAWL
        [1] = vector2(-642.06, 5295.47),
        [2] = vector2(-594.74, 5392.59),
        [3] = vector2(-451.87, 5359.08),
        [4] = vector2(-499.19, 5227.49),
    },
    { --- UPW
        [1] = vector2(532.32, 2834.87),
        [2] = vector2(541.52, 2714.07),
        [3] = vector2(668.28, 2724.53),
        [4] = vector2(660.12, 2842.84),
    },
    { --- TwitchNews
        [1] = vector2(-608.23, -906.54),
        [2] = vector2(-608.62, -945.35),
        [3] = vector2(-547.05, -944.04),
        [4] = vector2(-547.5, -906.46),
    },
}

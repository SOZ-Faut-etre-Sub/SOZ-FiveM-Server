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

Config.BlacklistedVehs = { --[[
    [GetHashKey("SHAMAL")] = true,
    [GetHashKey("LUXOR")] = true,
    [GetHashKey("LUXOR2")] = true,
    [GetHashKey("JET")] = true,
    [GetHashKey("LAZER")] = true,
    [GetHashKey("BUZZARD")] = true,
    [GetHashKey("BUZZARD2")] = true,
    [GetHashKey("ANNIHILATOR")] = true,
    [GetHashKey("SAVAGE")] = true,
    [GetHashKey("TITAN")] = true,
    [GetHashKey("RHINO")] = true,
    [GetHashKey("FIRETRUK")] = true,
    [GetHashKey("MULE")] = true,
    [GetHashKey("MAVERICK")] = true,
    [GetHashKey("BLIMP")] = true,
    [GetHashKey("AIRTUG")] = true,
    [GetHashKey("CAMPER")] = true,
    [GetHashKey("HYDRA")] = true,
    [GetHashKey("OPPRESSOR")] = true,
    [GetHashKey("technical3")] = true,
    [GetHashKey("insurgent3")] = true,
    [GetHashKey("apc")] = true,
    [GetHashKey("tampa3")] = true,
    [GetHashKey("trailersmall2")] = true,
    [GetHashKey("halftrack")] = true,
    [GetHashKey("hunter")] = true,
    [GetHashKey("vigilante")] = true,
    [GetHashKey("akula")] = true,
    [GetHashKey("barrage")] = true,
    [GetHashKey("khanjali")] = true,
    [GetHashKey("caracara")] = true,
    [GetHashKey("blimp3")] = true,
    [GetHashKey("menacer")] = true,
    [GetHashKey("oppressor2")] = true,
    [GetHashKey("scramjet")] = true,
    [GetHashKey("strikeforce")] = true,
    [GetHashKey("cerberus")] = true,
    [GetHashKey("cerberus2")] = true,
    [GetHashKey("cerberus3")] = true,
    [GetHashKey("scarab")] = true,
    [GetHashKey("scarab2")] = true,
    [GetHashKey("scarab3")] = true,
    [GetHashKey("rrocket")] = true,
    [GetHashKey("ruiner2")] = true,
    [GetHashKey("deluxo")] = true,
--]]
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
    [536071214] = {z = 0.5, y = -0.1},
    [603897027] = {z = 0.4},
    [GetHashKey("soz_v_club_bahbarstool")] = {x = -0.1, z = 0.35},
    [GetHashKey("soz_v_club_baham_bckt_chr")] = {z = 0.1},

    --poulpito
    [-1761659350] = {z = 0.5, x = 0.0, y = -0.12},
    [-1498352975] = {z = 0.35, x = 0.0, y = 0.25},
    [-232870343] = {z = 0.3, x = 0.0, y = -0.18, heading=180},
    [-2024837020] = {z = 1.5, x = 0.0, y = -0.5, heading=180},
    [47332588] = {z = 0.45, x = 0.0, y = -0.09},
    [-403891623] = {z = 0.45, x = 0.6, y = -0.12},
    [-741944541] = {z = 0.48, x = 0.0, y = -0.12},
    [-1521264200] = {z = 0.01, x = 0.0, y = -0.12},
    [1805980844] = {z = 0.45, x = 0.6, y = -0.10},
    [1404176808] = {z = 0.54, x = 0.0, y = -0.02},
    [525667351] = {z = 0.50, x = 0.0, y = -0.06},
    [764848282] = {z = 0.50, x = 0.0, y = -0.02},
    [1681727376] = {z = 0.51, x = 0.0, y = -0.6},
    [-99500382] = {z = 0.30, x = 0.0, y = -0.02},
    [-628719744] = {z = 0.5, x = 0.0, y = 0.0},
    [-1631057904] = {z = 0.45, x = 0.6, y = -0.08},
    [-1317098115] = {z = 0.5, x = 0.0, y = 0.0},
    [1290593659] = {z = 0.42, x = 0.6, y = 0.0},
    [1071807406] = {z = 0.07, x = 0.0, y = -0.12},
    [-1841495633] = {z = 0.5, x = -0.5, y = 0.0},

    [-67906175] = {z = 0.5, x = -0.5, y = 0.0},
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

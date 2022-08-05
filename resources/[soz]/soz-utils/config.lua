Config = {}
Config.MaxWidth = 5.0
Config.MaxHeight = 5.0
Config.MaxLength = 5.0
Config.DamageNeeded = 100.0
Config.EnableProne = true
Config.JointEffectTime = 60
Config.RemoveWeaponDrops = true
Config.RemoveWeaponDropsTimer = 25

--- Refill 100% for stress test
ConsumablesEat = {
    ["sandwich"] = math.random(35, 54),
    ["tosti"] = math.random(40, 50),
    ["twerks_candy"] = math.random(35, 54),
    ["snikkel_candy"] = math.random(40, 50),
    ["sausage1"] = math.random(40, 70),
    ["sausage2"] = math.random(40, 70),
    ["sausage3"] = math.random(40, 70),
    ["sausage4"] = math.random(40, 70),
    ["sausage5"] = math.random(40, 70),
    ["cheese1"] = math.random(40, 70),
    ["cheese2"] = math.random(40, 70),
    ["cheese3"] = math.random(40, 70),
    ["cheese4"] = math.random(40, 70),
    ["cheese5"] = math.random(40, 70),
    ["cheese6"] = math.random(40, 70),
    ["cheese7"] = math.random(40, 70),
    ["cheese8"] = math.random(40, 70),
    ["cheese9"] = math.random(40, 70),
}

--- Refill 100% for stress test
ConsumablesDrink = {
    ["water_bottle"] = math.random(35, 54),
    ["coffee"] = math.random(40, 50),
    ["kurkakola"] = math.random(35, 54),
    ["beer"] = math.random(5, 10),
    ["wine1"] = math.random(5, 10),
    ["wine2"] = math.random(5, 10),
    ["wine3"] = math.random(5, 10),
    ["wine4"] = math.random(5, 10),
    ["milk"] = math.random(40, 70),
    ["grapejuice1"] = math.random(40, 70),
    ["grapejuice2"] = math.random(40, 70),
    ["grapejuice3"] = math.random(40, 70),
    ["grapejuice4"] = math.random(40, 70),
    ["grapejuice5"] = math.random(40, 70),
    ["narito"] = math.random(5, 10),
    ["lapicolada"] = math.random(5, 10),
    ["sunrayou"] = math.random(5, 10),
    ["ponche"] = math.random(5, 10),
    ["pinkenny"] = math.random(5, 10),
    ["phasmopolitan"] = math.random(5, 10),
    ["escalier"] = math.random(5, 10),
    ["whicanelle"] = math.random(5, 10),
}

ConsumablesAlcohol = {
    ["beer"] = math.random(4, 8),
    ["wine1"] = math.random(25, 35),
    ["wine2"] = math.random(25, 35),
    ["wine3"] = math.random(25, 35),
    ["wine4"] = math.random(25, 35),
    ["narito"] = math.random(12, 17),
    ["lapicolada"] = math.random(12, 17),
    ["sunrayou"] = math.random(12, 17),
    ["ponche"] = math.random(12, 17),
    ["pinkenny"] = math.random(12, 17),
    ["phasmopolitan"] = math.random(12, 17),
    ["escalier"] = math.random(12, 17),
    ["whicanelle"] = math.random(12, 17),
}

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
    [536071214] = {z = 0.5},
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

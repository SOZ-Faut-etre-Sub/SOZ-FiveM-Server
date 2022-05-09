Config = {}
Config.MaxWidth = 5.0
Config.MaxHeight = 5.0
Config.MaxLength = 5.0
Config.DamageNeeded = 100.0
Config.EnableProne = true
Config.JointEffectTime = 60
Config.RemoveWeaponDrops = true
Config.RemoveWeaponDropsTimer = 25
Config.DefaultPrice = 20 -- carwash
Config.DirtLevel = 0.1 -- carwash dirt level

ConsumablesEat = {
    ["sandwich"] = math.random(35, 54),
    ["tosti"] = math.random(40, 50),
    ["twerks_candy"] = math.random(35, 54),
    ["snikkel_candy"] = math.random(40, 50),
}

ConsumablesDrink = {
    ["water_bottle"] = math.random(35, 54),
    ["kurkakola"] = math.random(35, 54),
    ["coffee"] = math.random(40, 50),
    ["whiskey"] = math.random(5, 10),
    ["beer"] = math.random(5, 10),
    ["vodka"] = math.random(5, 10),
}

ConsumablesAlcohol = {
    ["whiskey"] = math.random(20, 30),
    ["beer"] = math.random(30, 40),
    ["vodka"] = math.random(20, 40),
}

ConsumablesDrug = {
    ["joint"] = math.random(20, 30),
    ["crack_baggy"] = math.random(30, 50),
    ["cokebaggy"] = math.random(30, 50),
    ["xtcbaggy"] = math.random(30, 50),
    ["meth"] = math.random(30, 50),
}

Config.BlacklistedScenarios = {
    ["TYPES"] = {
        "WORLD_VEHICLE_MILITARY_PLANES_SMALL",
        "WORLD_VEHICLE_MILITARY_PLANES_BIG",
        "WORLD_VEHICLE_AMBULANCE",
        "WORLD_VEHICLE_POLICE_NEXT_TO_CAR",
        "WORLD_VEHICLE_POLICE_CAR",
        "WORLD_VEHICLE_POLICE_BIKE",
    },
    ["GROUPS"] = {2017590552, 2141866469, 1409640232, GetHashKey("ng_planes")},
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

Config.SeatChairOffset = {[444105316] = 0.5, [1037469683] = 0.4, [-109356459] = 0.5}

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

}

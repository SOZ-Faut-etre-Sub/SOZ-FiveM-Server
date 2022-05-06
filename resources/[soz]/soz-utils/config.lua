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

Config.DisabledVehicle = {
    [GetHashKey("LAZER")] = true,
    [GetHashKey("BUZZARD")] = true,
    [GetHashKey("ANNIHILATOR")] = true,
    [GetHashKey("SAVAGE")] = true,
    [GetHashKey("RHINO")] = true,
    [GetHashKey("HYDRA")] = true,
    [GetHashKey("OPPRESSOR")] = true,
    [GetHashKey("technical")] = true,
    [GetHashKey("technical2")] = true,
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
}

Config.DisabledPeds = {
    [GetHashKey("s_m_y_ranger_01")] = true,
    [GetHashKey("s_m_y_sheriff_01")] = true,
    [GetHashKey("s_m_y_cop_01")] = true,
    [GetHashKey("s_f_y_sheriff_01")] = true,
    [GetHashKey("s_f_y_cop_01")] = true,
    [GetHashKey("s_m_y_hwaycop_01")] = true,
}

Config.Teleports = {}

Config.CarWash = { -- carwash
    [1] = {["label"] = "Lavage Auto", ["coords"] = vector3(25.29, -1391.96, 29.33)},
    [2] = {["label"] = "Lavage Auto", ["coords"] = vector3(174.18, -1736.66, 29.35)},
    [3] = {["label"] = "Lavage Auto", ["coords"] = vector3(-74.56, 6427.87, 31.44)},
    [5] = {["label"] = "Lavage Auto", ["coords"] = vector3(1363.22, 3592.7, 34.92)},
    [6] = {["label"] = "Lavage Auto", ["coords"] = vector3(-699.62, -932.7, 19.01)},
}

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

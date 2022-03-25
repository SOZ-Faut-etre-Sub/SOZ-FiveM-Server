Config = {}

Config.AllowedJobInteraction = {"lspd", "bcso"}

Config.Badge = GetHashKey("prop_fib_badge")

Config.Locations = {
    ["stations"] = {
        ["LSPD"] = {
            label = "Los Santos Police Department",
            blip = {sprite = 60, color = 29},
            coords = vector3(632.76, 7.31, 82.63),
        },
        ["BCSO"] = {
            label = "Blaine Country Sheriff's Office",
            blip = {sprite = 60, color = 21},
            coords = vector3(1856.15, 3681.68, 34.27),
        },
    },
    ["moneychecker"] = {["lspd"] = vector3(587.51, 13.24, 75.70)},
}

Config.WeaponShop = {
    ["lspd"] = {
        [1] = {name = "weapon_nightstick", metadata = {}, price = 50, amount = 1},
        [2] = {name = "weapon_flashlight", metadata = {}, price = 50, amount = 1},
        [3] = {name = "weapon_stungun", metadata = {}, price = 100, amount = 1},
        [4] = {name = "radio", metadata = {}, price = 300, amount = 50},
        [5] = {name = "armor", metadata = {}, price = 500, amount = 50},
        [6] = {name = "heavyarmor", metadata = {}, price = 1000, amount = 50},
        [7] = {name = "handcuffs", metadata = {}, price = 50, amount = 10},
        [8] = {name = "handcuffs_key", metadata = {}, price = 50, amount = 10},
        [9] = {name = "spike", metadata = {}, price = 50, amount = 10},
        [10] = {name = "cone", metadata = {}, price = 50, amount = 10},
        [11] = {name = "police_barrier", metadata = {}, price = 50, amount = 10},
        [12] = {
            name = "weapon_pistol_mk2",
            metadata = {attachments = {{component = "COMPONENT_AT_PI_FLSH", label = "Flashlight"}}},
            price = 200,
            amount = 1,
        },
        [13] = {
            name = "weapon_pumpshotgun",
            metadata = {attachments = {{component = "COMPONENT_AT_AR_FLSH", label = "Flashlight"}}},
            price = 300,
            amount = 1,
        },
        [14] = {name = "pistol_ammo", metadata = {}, price = 50, amount = 5},
        [15] = {name = "shotgun_ammo", metadata = {}, price = 50, amount = 5},
    },
    ["bcso"] = {
        [1] = {name = "weapon_nightstick", metadata = {}, price = 50, amount = 1},
        [2] = {name = "weapon_flashlight", metadata = {}, price = 50, amount = 1},
        [3] = {name = "weapon_stungun", metadata = {}, price = 100, amount = 1},
        [4] = {name = "radio", metadata = {}, price = 300, amount = 50},
        [5] = {name = "armor", metadata = {}, price = 500, amount = 50},
        [6] = {name = "heavyarmor", metadata = {}, price = 1000, amount = 50},
        [7] = {name = "handcuffs", metadata = {}, price = 50, amount = 10},
        [8] = {name = "handcuffs_key", metadata = {}, price = 50, amount = 10},
        [9] = {name = "spike", metadata = {}, price = 50, amount = 10},
        [10] = {name = "cone", metadata = {}, price = 50, amount = 10},
        [11] = {name = "police_barrier", metadata = {}, price = 50, amount = 10},
        [12] = {
            name = "weapon_revolver_mk2",
            metadata = {attachments = {{component = "COMPONENT_AT_PI_FLSH", label = "Flashlight"}}},
            price = 200,
            amount = 1,
        },
        [13] = {
            name = "weapon_pumpshotgun",
            metadata = {attachments = {{component = "COMPONENT_AT_AR_FLSH", label = "Flashlight"}}},
            price = 300,
            amount = 1,
        },
        [14] = {name = "pistol_ammo", metadata = {}, price = 50, amount = 5},
        [15] = {name = "shotgun_ammo", metadata = {}, price = 50, amount = 5},
    },
}

--- Licenses
Config.Licenses = {
    ["car"] = {label = "Permis voiture"},
    ["truck"] = {label = "Permis poids lourd"},
    ["motorcycle"] = {label = "Permis moto"},
    ["heli"] = {label = "Permis d'aviation"},
    ["boat"] = {label = "Permis maritime"},
    ["weapon"] = {label = "Permis port d'arme"},
    ["hunting"] = {label = "Permis de chase"},
    ["fishing"] = {label = "Permis de pêche"},
    ["rescuer"] = {label = "Secouriste"},
}

Config.RadarAllowedVehicle = {
    [GetHashKey("ambulance")] = true,
    [GetHashKey("police")] = true,
    [GetHashKey("police2")] = true,
    [GetHashKey("police3")] = true,
    [GetHashKey("policeb")] = true,
    [GetHashKey("pbus")] = true,
    [GetHashKey("sheriff")] = true,
    [GetHashKey("sheriff2")] = true,
}
--- Fines
Config.Fines = {
    [1] = {label = "Sans catégorie", items = {{label = "TIG", price = 0}}},
    [2] = {
        label = "Catégorie 1",
        items = {
            {label = "Conduite sans permis", price = 3000},
            {label = "Insulte / Outrage standard", price = 4000},
            {label = "Insulte / Outrage majorée", price = 8000},
            {label = "Rappel à la loi minorée", price = 250},
            {label = "Rappel à la loi standard", price = 500},
            {label = "Rappel à la loi majorée", price = 750},
        },
    },
    [3] = {
        label = "Catégorie 2",
        items = {
            {label = "Dégradation de bien public", price = 4000},
            {label = "Braquage de commerce minorée", price = 1000},
            {label = "Braquage de commerce standard", price = 2500},
            {label = "Braquage de commerce majorée", price = 5000},
            {label = "Port d'arme sans permis", price = 3000},
            {label = "Vol de véhicule minorée", price = 1500},
            {label = "Vol de véhicule standard", price = 4500},
            {label = "Vol de véhicule majorée", price = 10000},
        },
    },
    [4] = {
        label = "Catégorie 3",
        items = {
            {label = "Agression à main armée standard", price = 30000},
            {label = "Agression à main armée majorée", price = 40000},
            {label = "Braquage de Fleeca minorée", price = 10000},
            {label = "Braquage de Fleeca standard", price = 20000},
            {label = "Braquage de Fleeca majorée", price = 30000},
            {label = "Tentative de corruption", price = 15000},
            {label = "Vol à main armée", price = 15000},
        },
    },
    [5] = {label = "Catégorie 4", items = {{label = "Corruption", price = 50000}}},
}

--- Radars config
Config.RadarAllowedVehicle = {"ambulance", "police", "police2", "police3", "policeb", "pbus", "sheriff", "sheriff2"}

Config.Radars = {
    [1] = {
        props = vector4(-54.77, 6338.8, 30.33, 155.46),
        zone = vector3(-60.35, 6321.91, 31.3),
        station = "bcso",
        isOnline = true,
        zoneRadius = 9,
        speed = 90,
    },
    [2] = {
        props = vector4(2365.11, 5763.63, 44.94, 236.35),
        zone = vector3(2386.17, 5745.69, 45.73),
        station = "bcso",
        isOnline = true,
        zoneRadius = 10,
        speed = 120,
    },
    [3] = {
        props = vector4(-2831.09, 2176.07, 30.84, 320.84),
        zone = vector3(-2813.6, 2202.67, 28.91),
        station = "bcso",
        isOnline = true,
        zoneRadius = 15,
        speed = 120,
    },
    [4] = {
        props = vector4(2149.54, 3761.94, 31.89, 320.54),
        zone = vector3(2161.77, 3778.34, 33.36),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [5] = {
        props = vector4(710.03, 2707.9, 39.23, 116.24),
        zone = vector3(695.75, 2700.52, 40.5),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [6] = {
        props = vector4(2234.08, 4744.3, 38.66, 111.03),
        zone = vector3(2221.52, 4739.29, 40.14),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [7] = {
        props = vector4(1131.91, 1890.94, 64.72, 42.22),
        zone = vector3(1118.43, 1909.73, 63.44),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [8] = {
        props = vector4(-1434.12, 1930.06, 72.43, 202.18),
        zone = vector3(-1425.47, 1905.34, 74.05),
        station = "bcso",
        isOnline = true,
        zoneRadius = 10,
        speed = 90,
    },
    [9] = {
        props = vector4(2767.39, 4601.74, 44.2, 29.84),
        zone = vector3(2751.96, 4625.0, 44.89),
        station = "bcso",
        isOnline = true,
        zoneRadius = 10,
        speed = 90,
    },
    [10] = {
        props = vector4(-797.55, 2231.07, 86.17, 356.3),
        zone = vector3(-798.91, 2252.27, 84.23),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [11] = {
        props = vector4(-2467.23, -219.14, 16.65, 220.11),
        zone = vector3(-2447.98, -238.33, 16.61),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 120,
    },
    [12] = {
        props = vector4(-1919.08, 692.07, 125.73, 166.88),
        zone = vector3(-1922.6, 671.7, 125.62),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 90,
    },
    [13] = {
        props = vector4(-1650.11, -600.63, 32.63, 259.89),
        zone = vector3(-1622.3, -606.86, 32.67),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 90,
    },
    [14] = {
        props = vector4(-11.96, -441.02, 39.34, 7.71),
        zone = vector3(-17.41, -405.88, 39.68),
        station = "lspd",
        isOnline = true,
        zoneRadius = 14,
        speed = 90,
    },
    [15] = {
        props = vector4(-163.0, 109.87, 69.42, 215.3),
        zone = vector3(-148.8, 90.02, 70.77),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [16] = {
        props = vector4(736.53, -1725.36, 28.38, 221.79),
        zone = vector3(762.64, -1740.99, 29.52),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 90,
    },
    [17] = {
        props = vector4(-943.88, -1818.97, 18.8, 330.71),
        zone = vector3(-933.51, -1797.83, 19.84),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [18] = {
        props = vector4(-699.19, -824.05, 22.75, 225.37),
        zone = vector3(-681.3, -837.16, 24.14),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 90,
    },
    [19] = {
        props = vector4(844.38, 141.1, 71.3, 301.84),
        zone = vector3(868.5, 154.6, 73.41),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 120,
    },
    [20] = {
        props = vector4(-1001.81, 102.48, 51.33, 59.55),
        zone = vector3(-1014.42, 114.04, 52.91),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
}

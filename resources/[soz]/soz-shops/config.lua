Config = {}

Config.Products = {
    ["normal"] = {
        [1] = {name = "water_bottle", price = 2, amount = 50},
        [2] = {name = "coffee", price = 2, amount = 50},
        [3] = {name = "kurkakola", price = 2, amount = 50},
        [4] = {name = "tosti", price = 2, amount = 50},
        [5] = {name = "twerks_candy", price = 2, amount = 50},
        [6] = {name = "snikkel_candy", price = 2, amount = 50},
        [7] = {name = "sandwich", price = 2, amount = 50},
        [8] = {name = "phone", price = 150, amount = 50},
    },
    ["weapons"] = {
        [1] = {name = "weapon_knife", price = 250, amount = 250},
        [2] = {name = "weapon_bat", price = 250, amount = 250},
        [3] = {name = "weapon_hatchet", price = 250, amount = 250, requiredJob = {"mechanic", "police"}},
        [4] = {name = "weapon_pistol", price = 2500, amount = 5},
        [5] = {name = "weapon_snspistol", price = 1500, amount = 5},
        [6] = {name = "weapon_vintagepistol", price = 4000, amount = 5},
        [7] = {name = "pistol_ammo", price = 250, amount = 250},
    },
}

local shopConfig = {
    ["247"] = {label = "24/7 Supermarket", blip = {sprite = 52, color = 2}, pedModel = "ig_ashley"},
    ["ltd"] = {label = "LTD Gasoline", blip = {sprite = 52, color = 5}, pedModel = "s_m_m_autoshop_02"},
    ["liquor"] = {label = "Rob's Liqour", blip = {sprite = 52, color = 7}, pedModel = "a_m_m_genfat_02"},
    ["ammunation"] = {label = "Ammu-Nation", blip = {sprite = 110, color = 17}, pedModel = "s_m_y_ammucity_01"},
}

Config.Locations = {
    -- 24/7 Locations
    ["247supermarket"] = {
        label = shopConfig["247"].label,
        coords = vector4(24.14, -1347.22, 29.5, 273.39),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket2"] = {
        label = shopConfig["247"].label,
        coords = vector4(-3038.86, 584.36, 7.91, 22.65),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket3"] = {
        label = shopConfig["247"].label,
        coords = vector4(-3242.29, 999.76, 12.83, 0.41),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket4"] = {
        label = shopConfig["247"].label,
        coords = vector4(1727.7, 6415.4, 35.04, 237.95),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket5"] = {
        label = shopConfig["247"].label,
        coords = vector4(1959.84, 3739.86, 32.34, 299.67),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket6"] = {
        label = shopConfig["247"].label,
        coords = vector4(549.28, 2671.37, 42.16, 98.65),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket7"] = {
        label = shopConfig["247"].label,
        coords = vector4(2677.93, 3279.31, 55.24, 333.41),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket8"] = {
        label = shopConfig["247"].label,
        coords = vector4(2557.18, 380.64, 108.62, 1.74),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },
    ["247supermarket9"] = {
        label = shopConfig["247"].label,
        coords = vector4(372.45, 326.52, 103.57, 254.29),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
    },

    -- LTD Gasoline Locations
    ["ltdgasoline"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(-46.7, -1757.9, 29.42, 49.1),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
    },
    ["ltdgasoline2"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(-706.16, -913.5, 19.22, 88.63),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
    },
    ["ltdgasoline3"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(-1820.21, 794.29, 138.09, 126.03),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
    },
    ["ltdgasoline4"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(1164.68, -322.59, 69.21, 110.25),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
    },
    ["ltdgasoline5"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(1698.2, 4922.86, 42.06, 324.94),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
    },

    -- Rob's Liquor Locations
    ["robsliquor"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(-1222.01, -908.37, 12.33, 31.52),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
    },
    ["robsliquor2"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(-1486.2, -378.01, 40.16, 135.93),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
    },
    ["robsliquor3"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(-2966.38, 390.94, 15.04, 86.14),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
    },
    ["robsliquor4"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(1165.93, 2710.81, 38.16, 180.89),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
    },
    ["robsliquor5"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(1134.15, -982.51, 46.42, 281.3),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
    },

    -- Ammu-Nation Locations
    ["ammunation"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(-661.61, -933.49, 21.83, 176.46),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation2"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(809.58, -2159.08, 29.62, 359.76),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation3"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(1692.65, 3761.4, 34.71, 225.95),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation4"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(-331.22, 6085.34, 31.45, 225.39),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation5"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(253.6, -51.11, 69.94, 64.6),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation6"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(23.06, -1105.72, 29.8, 162.29),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation7"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(2567.43, 292.62, 108.73, 1.02),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation8"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(-1118.56, 2700.09, 18.55, 229.33),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
    ["ammunation9"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(841.8, -1035.26, 28.19, 356.67),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
    },
}

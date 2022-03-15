local shopConfig = {
    ["247"] = {label = "Supérette", type = "shop", blip = {sprite = 52, color = 2, scale = 0.8}, pedModel = "ig_ashley"},
    ["ltd"] = {label = "Supérette", type = "shop", blip = {sprite = 52, color = 2, scale = 0.8}, pedModel = "s_m_m_autoshop_02"},
    ["liquor"] = {label = "Supérette", type = "shop", blip = {sprite = 52, color = 2, scale = 0.8}, pedModel = "a_m_m_genfat_02"},
}

Config.Products["normal"] = {
    [1] = {name = "water_bottle", price = 2, amount = 50},
    [2] = {name = "coffee", price = 2, amount = 50},
    [3] = {name = "kurkakola", price = 2, amount = 50},
    [4] = {name = "tosti", price = 2, amount = 50},
    [5] = {name = "twerks_candy", price = 2, amount = 50},
    [6] = {name = "snikkel_candy", price = 2, amount = 50},
    [7] = {name = "sandwich", price = 2, amount = 50},
    [8] = {name = "phone", price = 150, amount = 50},
}

-- 24/7 Locations
Config.Locations["247supermarket"] = {
    label = shopConfig["247"].label,
    coords = vector4(24.14, -1347.22, 29.5, 273.39),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket2"] = {
    label = shopConfig["247"].label,
    coords = vector4(-3038.86, 584.36, 7.91, 22.65),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket3"] = {
    label = shopConfig["247"].label,
    coords = vector4(-3242.29, 999.76, 12.83, 0.41),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket4"] = {
    label = shopConfig["247"].label,
    coords = vector4(1727.7, 6415.4, 35.04, 237.95),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket5"] = {
    label = shopConfig["247"].label,
    coords = vector4(1959.84, 3739.86, 32.34, 299.67),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket6"] = {
    label = shopConfig["247"].label,
    coords = vector4(549.28, 2671.37, 42.16, 98.65),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket7"] = {
    label = shopConfig["247"].label,
    coords = vector4(2677.93, 3279.31, 55.24, 333.41),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket8"] = {
    label = shopConfig["247"].label,
    coords = vector4(2557.18, 380.64, 108.62, 1.74),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}
Config.Locations["247supermarket9"] = {
    label = shopConfig["247"].label,
    coords = vector4(372.45, 326.52, 103.57, 254.29),
    products = Config.Products["normal"],
    blip = shopConfig["247"].blip,
    pedModel = shopConfig["247"].pedModel,
    type = shopConfig["247"].type,
}

-- LTD GasolineLocations
Config.Locations["ltdgasoline"] = {
    label = shopConfig["ltd"].label,
    coords = vector4(-46.7, -1757.9, 29.42, 49.1),
    products = Config.Products["normal"],
    blip = shopConfig["ltd"].blip,
    pedModel = shopConfig["ltd"].pedModel,
    type = shopConfig["ltd"].type,
}
Config.Locations["ltdgasoline2"] = {
    label = shopConfig["ltd"].label,
    coords = vector4(-706.16, -913.5, 19.22, 88.63),
    products = Config.Products["normal"],
    blip = shopConfig["ltd"].blip,
    pedModel = shopConfig["ltd"].pedModel,
    type = shopConfig["ltd"].type,
}
Config.Locations["ltdgasoline3"] = {
    label = shopConfig["ltd"].label,
    coords = vector4(-1820.21, 794.29, 138.09, 126.03),
    products = Config.Products["normal"],
    blip = shopConfig["ltd"].blip,
    pedModel = shopConfig["ltd"].pedModel,
    type = shopConfig["ltd"].type,
}
Config.Locations["ltdgasoline4"] = {
    label = shopConfig["ltd"].label,
    coords = vector4(1164.68, -322.59, 69.21, 110.25),
    products = Config.Products["normal"],
    blip = shopConfig["ltd"].blip,
    pedModel = shopConfig["ltd"].pedModel,
    type = shopConfig["ltd"].type,
}
Config.Locations["ltdgasoline5"] = {
    label = shopConfig["ltd"].label,
    coords = vector4(1698.2, 4922.86, 42.06, 324.94),
    products = Config.Products["normal"],
    blip = shopConfig["ltd"].blip,
    pedModel = shopConfig["ltd"].pedModel,
    type = shopConfig["ltd"].type,
}

-- Rob's LiquorLocations
Config.Locations["robsliquor"] = {
    label = shopConfig["liquor"].label,
    coords = vector4(-1222.01, -908.37, 12.33, 31.52),
    products = Config.Products["normal"],
    blip = shopConfig["liquor"].blip,
    pedModel = shopConfig["liquor"].pedModel,
    type = shopConfig["liquor"].type,
}
Config.Locations["robsliquor2"] = {
    label = shopConfig["liquor"].label,
    coords = vector4(-1486.2, -378.01, 40.16, 135.93),
    products = Config.Products["normal"],
    blip = shopConfig["liquor"].blip,
    pedModel = shopConfig["liquor"].pedModel,
    type = shopConfig["liquor"].type,
}
Config.Locations["robsliquor3"] = {
    label = shopConfig["liquor"].label,
    coords = vector4(-2966.38, 390.94, 15.04, 86.14),
    products = Config.Products["normal"],
    blip = shopConfig["liquor"].blip,
    pedModel = shopConfig["liquor"].pedModel,
    type = shopConfig["liquor"].type,
}
Config.Locations["robsliquor4"] = {
    label = shopConfig["liquor"].label,
    coords = vector4(1165.93, 2710.81, 38.16, 180.89),
    products = Config.Products["normal"],
    blip = shopConfig["liquor"].blip,
    pedModel = shopConfig["liquor"].pedModel,
    type = shopConfig["liquor"].type,
}
Config.Locations["robsliquor5"] = {
    label = shopConfig["liquor"].label,
    coords = vector4(1134.15, -982.51, 46.42, 281.3),
    products = Config.Products["normal"],
    blip = shopConfig["liquor"].blip,
    pedModel = shopConfig["liquor"].pedModel,
    type = shopConfig["liquor"].type,
}

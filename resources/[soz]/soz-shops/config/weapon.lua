local shopConfig = {
    ["ammunation"] = {
        label = "Ammu-Nation",
        type = "weapon",
        blip = {sprite = 110, color = 17},
        pedModel = "s_m_y_ammucity_01",
    },
}

Config.Products["weapons"] = {
    [1] = {name = "weapon_knife", price = 250, amount = 250},
    [2] = {name = "weapon_bat", price = 250, amount = 250},
    [3] = {name = "weapon_hatchet", price = 250, amount = 250, requiredJob = {"mechanic", "police"}},
    [4] = {name = "weapon_pistol", price = 2500, amount = 5},
    [5] = {name = "weapon_snspistol", price = 1500, amount = 5},
    [6] = {name = "weapon_vintagepistol", price = 4000, amount = 5},
    [7] = {name = "pistol_ammo", price = 250, amount = 250},
}

Config.Locations["ammunation"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(-661.61, -933.49, 21.83, 176.46),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation2"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(809.58, -2159.08, 29.62, 359.76),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation3"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(1692.65, 3761.4, 34.71, 225.95),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation4"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(-331.22, 6085.34, 31.45, 225.39),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation5"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(253.6, -51.11, 69.94, 64.6),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation6"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(23.06, -1105.72, 29.8, 162.29),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation7"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(2567.43, 292.62, 108.73, 1.02),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation8"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(-1118.56, 2700.09, 18.55, 229.33),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}
Config.Locations["ammunation9"] = {
    label = shopConfig["ammunation"].label,
    coords = vector4(841.8, -1035.26, 28.19, 356.67),
    products = Config.Products["weapons"],
    blip = shopConfig["ammunation"].blip,
    pedModel = shopConfig["ammunation"].pedModel,
    type = shopConfig["ammunation"].type,
}

local shopConfig = {
    ["tattoo"] = {label = "Tatoueur", type = "tattoo", blip = {sprite = 75, color = 1, scale = 0.8}, pedModel = "u_m_y_tattoo_01"},
}

Config.Products["tattoo"] = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/tattoos.json"))

Config.TattooCategories = {
    ["ZONE_HEAD"] = {
        label = "Visage",
        cam = {vec(0.0, 0.7, 0.7), vec(0.7, 0.0, 0.7), vec(0.0, -0.7, 0.7), vec(-0.7, 0.0, 0.7)},
        player = vec(0.0, 0.0, 0.5),
    },
    ["ZONE_TORSO"] = {label = "Torse", cam = {vec(0.0, 0.7, 0.2), vec(0.0, -0.7, 0.2)}, player = vec(0.0, 0.0, 0.2)},
    ["ZONE_LEFT_ARM"] = {
        label = "Bras gauche",
        cam = {vec(-0.4, 0.5, 0.2), vec(-0.7, 0.0, 0.2), vec(-0.4, -0.5, 0.2)},
        player = vec(-0.2, 0.0, 0.2),
    },
    ["ZONE_RIGHT_ARM"] = {
        label = "Bras droit",
        cam = {vec(0.4, 0.5, 0.2), vec(0.7, 0.0, 0.2), vec(0.4, -0.5, 0.2)},
        player = vec(0.2, 0.0, 0.2),
    },
    ["ZONE_LEFT_LEG"] = {
        label = "Jambe gauche",
        cam = {vec(-0.2, 0.7, -0.7), vec(-0.7, 0.0, -0.7), vec(-0.2, -0.7, -0.7)},
        player = vec(-0.2, 0.0, -0.6),
    },
    ["ZONE_RIGHT_LEG"] = {
        label = "Jambe droite",
        cam = {vec(0.2, 0.7, -0.7), vec(0.7, 0.0, -0.7), vec(0.2, -0.7, -0.7)},
        player = vec(0.2, 0.0, -0.6),
    },
}

Config.Locations["tattooshop"] = {
    label = shopConfig["tattoo"].label,
    coords = vector4(319.67, 181.11, 103.59, 248.97),
    inShopCoords = vector4(324.69, 180.53, 103.59, 134.05),
    products = Config.Products["tattoo"],
    blip = shopConfig["tattoo"].blip,
    pedModel = shopConfig["tattoo"].pedModel,
    type = shopConfig["tattoo"].type,
}
Config.Locations["tattooshop2"] = {
    label = shopConfig["tattoo"].label,
    coords = vector4(1862.56, 3748.41, 33.03, 33.12),
    inShopCoords = vector4(1864.91, 3746.62, 33.03, 28.24),
    products = Config.Products["tattoo"],
    blip = shopConfig["tattoo"].blip,
    pedModel = shopConfig["tattoo"].pedModel,
    type = shopConfig["tattoo"].type,
}
Config.Locations["tattooshop3"] = {
    label = shopConfig["tattoo"].label,
    coords = vector4(-292.15, 6199.63, 31.49, 232.53),
    inShopCoords = vector4(-294.79, 6200.76, 31.49, 212.67),
    products = Config.Products["tattoo"],
    blip = shopConfig["tattoo"].blip,
    pedModel = shopConfig["tattoo"].pedModel,
    type = shopConfig["tattoo"].type,
}
Config.Locations["tattooshop4"] = {
    label = shopConfig["tattoo"].label,
    coords = vector4(-1151.95, -1423.96, 4.95, 128.08),
    inShopCoords = vector4(-1155.23, -1427.59, 4.95, 6.04),
    products = Config.Products["tattoo"],
    blip = shopConfig["tattoo"].blip,
    pedModel = shopConfig["tattoo"].pedModel,
    type = shopConfig["tattoo"].type,
}
Config.Locations["tattooshop5"] = {
    label = shopConfig["tattoo"].label,
    coords = vector4(1324.83, -1650.14, 52.28, 129.56),
    inShopCoords = vector4(1321.72, -1654.25, 52.28, 9.94),
    products = Config.Products["tattoo"],
    blip = shopConfig["tattoo"].blip,
    pedModel = shopConfig["tattoo"].pedModel,
    type = shopConfig["tattoo"].type,
}
Config.Locations["tattooshop6"] = {
    label = shopConfig["tattoo"].label,
    coords = vector4(-3170.73, 1072.86, 20.83, 332.32),
    inShopCoords = vector4(-3169.81, 1077.92, 20.83, 220.92),
    products = Config.Products["tattoo"],
    blip = shopConfig["tattoo"].blip,
    pedModel = shopConfig["tattoo"].pedModel,
    type = shopConfig["tattoo"].type,
}

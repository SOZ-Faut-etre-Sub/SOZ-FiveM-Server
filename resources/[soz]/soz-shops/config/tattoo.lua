Config.Products["tattoo"] = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/tattoos.json"))

Config.Locations["tattoo"] = {
    ["tattooshop"] = vector4(319.67, 181.11, 103.59, 248.97),
    ["tattooshop2"] = vector4(1862.56, 3748.41, 33.03, 33.12),
    ["tattooshop3"] = vector4(-292.15, 6199.63, 31.49, 232.53),
    ["tattooshop4"] = vector4(-1151.95, -1423.96, 4.95, 128.08),
    ["tattooshop5"] = vector4(1324.83, -1650.14, 52.28, 129.56),
    ["tattooshop6"] = vector4(-3170.73, 1072.86, 20.83, 332.32),
}

Config.TattooLocationsInShop = {
    ["tattooshop"] = vector4(324.69, 180.53, 103.59, 134.05),
    ["tattooshop2"] = vector4(1864.91, 3746.62, 33.03, 28.24),
    ["tattooshop3"] = vector4(-294.79, 6200.76, 31.49, 212.67),
    ["tattooshop4"] = vector4(-1155.23, -1427.59, 4.95, 6.04),
    ["tattooshop5"] = vector4(1321.72, -1654.25, 52.28, 9.94),
    ["tattooshop6"] = vector4(-3169.81, 1077.92, 20.83, 220.92),
}

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

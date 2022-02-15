Config = {}

Config.BlipName = "Auto-école"
Config.BlipSprite = 545
Config.BlipColor = 25
-- Blip coords are the same as Config.Peds.secretary (x, y)

Config.Peds = {
    ["instructor"] = {
        modelHash = "cs_manuel",
        x = 0.0, y = 0.0, z = 0.0, rotation = 0.0,
        networkSync = true
    },
    ["secretary"] = {
        modelHash = "u_f_y_princess",
        x = -815.36, y = -1346.72, z = 5.15, rotation = 49.8,
        networkSync = true
    },
}

Config.Licenses = {
    ["car"] = {
        vehicle = {
            modelHash = "dilettante2",
            x = -809.18, y = -1319.61, z = 4.49, rotation = 170.42,
            networkSync = true
        },
        event = "soz-driving-license:client:start_car",
        price = 1000,
        icon = "fas fa-car",
        label = "Passer le permis voiture ($%s)",
    },
    ["truck"] = {
        vehicle = {
            modelHash = "",
            x = 0.0, y = 0.0, z = 0.0, rotation = 0.0,
            networkSync = true
        },
        event = "",
        price = 2500,
        icon = "fas fa-truck",
        label = "Passer le permis camion ($%s)",
    },
    ["motorcycle"] = {
        vehicle = {
            modelHash = "",
            x = 0.0, y = 0.0, z = 0.0, rotation = 0.0,
            networkSync = true
        },
        event = "",
        price = 1000,
        icon = "fas fa-motorcycle",
        label = "Passer le permis moto ($%s)",
    },
}


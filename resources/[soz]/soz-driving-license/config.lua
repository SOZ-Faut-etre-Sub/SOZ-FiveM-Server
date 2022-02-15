Config = {}

Config.BlipName = "Auto-école"
Config.BlipSprite = 545
Config.BlipColor = 25

Config.Peds = {
    ["inspector"] = {
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
            x = 0.0, y = 0.0, z = 0.0, heading = 0.0,
            networkSync = true
        },
        event = "",
        price = 1000,
        icon = "fas fa-car",
        label = "Passer le permis voiture ($%s)",
    },
    ["truck"] = {
        vehicle = {
            modelHash = "",
            x = 0.0, y = 0.0, z = 0.0, heading = 0.0,
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
            x = 0.0, y = 0.0, z = 0.0, heading = 0.0,
            networkSync = true
        },
        event = "",
        price = 1000,
        icon = "fas fa-motorcycle",
        label = "Passer le permis moto ($%s)",
    },
}


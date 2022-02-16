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

Config.CheckpointType = 0
Config.CheckpointSize = 3.0
Config.CheckpointColor = {r = 12, g = 123, b = 86, a = 150}

Config.Checkpoints = {
    ["car"] = {
        {
            x = -819.35, y = -1324.4, z = 4.0,
            message = {
                "Ton examen va débuter. Boulce ta ceinture et nous pouvons partir.",
                "Suis ton GPS à allure modérée, et respecte les autres usagers de la route."
            }
        },
        {x = -837.18, y = -1303.95, z = 3.49},
        {
            x = -822.96, y = -1280.86, z = 3.49,
            message = "Continue comme ça !"
        },
        {x = -794.46, y = -1300.71, z = 3.49},
        {x = -803.86, y = -1326.61, z = 3.49},
    },
    ["truck"] = {},
    ["motorcycle"] = {},
}

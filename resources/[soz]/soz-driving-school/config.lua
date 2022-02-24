Config = {}

Config.BlipName = "Auto-école"
Config.BlipSprite = 545
Config.BlipColor = 25
-- Blip coords are the same as Config.Peds.secretary (x, y)

Config.Peds = {
    ["instructor"] = {modelHash = "cs_manuel", x = 0.0, y = 0.0, z = 0.0, rotation = 0.0, networkSync = true},
    ["secretary"] = {
        modelHash = "u_f_y_princess",
        x = -815.36,
        y = -1346.72,
        z = 5.15,
        rotation = 49.8,
        networkSync = true,
    },
}

Config.Licenses = {
    ["car"] = {
        vehicle = {
            modelHash = "dilettante2",
            x = -809.18,
            y = -1319.61,
            z = 4.49,
            rotation = 170.42,
            networkSync = true,
        },
        price = 1,
        icon = "fas fa-car",
        label = "Passer le permis voiture ($%s)",
        points = 12,
    },
    ["truck"] = {
        vehicle = {modelHash = "boxville4", x = -828.87, y = -1264.37, z = 4.57, rotation = 139.59, networkSync = true},
        price = 1,
        icon = "fas fa-truck",
        label = "Passer le permis camion ($%s)",
        points = 12,
    },
    ["motorcycle"] = {
        vehicle = {modelHash = "faggio", x = -805.25, y = -1336.23, z = 4.62, rotation = 315.04, networkSync = true},
        price = 1,
        icon = "fas fa-motorcycle",
        label = "Passer le permis moto ($%s)",
        points = 12,
    },
}

Config.VehiclePlateText = "P3RM15"

Config.PenaltyTickDelay = 200 -- in ms
Config.PenaltyMaxDuration = 3000 -- in ms

Config.CheckpointType = 0
Config.CheckpointSize = 3.0
Config.CheckpointColor = {r = 12, g = 123, b = 86, a = 150}

Config.InstructorStartSpeech = {
    "Ton examen va débuter. Boucle ta ceinture et nous pouvons partir.",
    "Suis ton GPS à allure modérée, et respecte les autres usagers de la route.",
}

Config.Checkpoints = {
    ["car"] = {
        {x = -704.06, y = -1246.4, z = 8.88},
        {x = -751.81, y = -1128.65, z = 9.18},
        {
            x = -630.52,
            y = -975.5,
            z = 19.9,
            message = "Ici, ce sont les bureaux de ~p~Twitch News~s~. Ils ne racontent que des salades...",
        },
        {x = -543.82, y = -1103.21, z = 20.88},
        {x = -630.09, y = -1265.14, z = 9.49},
        {x = -818.22, y = -1330.59, z = 3.58, message = "Tu es arrivé au bout. Bien joué !"},
    },
    ["truck"] = {
        {x = -704.06, y = -1246.4, z = 8.88},
        {x = -751.81, y = -1128.65, z = 9.18},
        {
            x = -630.52,
            y = -975.5,
            z = 19.9,
            message = "Ici, ce sont les bureaux de ~p~Twitch News~s~. Ils ne racontent que des salades...",
        },
        {x = -543.82, y = -1103.21, z = 20.88},
        {x = -630.09, y = -1265.14, z = 9.49},
        {x = -818.22, y = -1330.59, z = 3.58, message = "Tu es arrivé au bout. Bien joué !"},
    },
    ["motorcycle"] = {
        {x = -704.06, y = -1246.4, z = 8.88},
        {x = -751.81, y = -1128.65, z = 9.18},
        {
            x = -630.52,
            y = -975.5,
            z = 19.9,
            message = "Ici, ce sont les bureaux de ~p~Twitch News~s~. Ils ne racontent que des salades...",
        },
        {x = -543.82, y = -1103.21, z = 20.88},
        {x = -630.09, y = -1265.14, z = 9.49},
        {x = -818.22, y = -1330.59, z = 3.58, message = "Tu es arrivé au bout. Bien joué !"},
    },
}

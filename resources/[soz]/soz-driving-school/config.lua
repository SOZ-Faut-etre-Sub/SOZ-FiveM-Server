Config = {}

Config.BlipName = "Auto-école"
Config.BlipSprite = 545
Config.BlipColor = 25
Config.BlipScale = 0.8
-- Blip coords are the same as Config.Peds.secretary (x, y)

-- Coords where to teleport player to, at the end of exam
Config.PlayerDefaultLocation = vector4(-806.57, -1344.53, 5.50, 150.0)

Config.Peds = {
    ["instructor"] = {modelHash = "cs_manuel", x = 0.0, y = 0.0, z = 0.0, rotation = 0.0, networkSync = true},
    ["secretary"] = {
        modelHash = "u_f_y_princess",
        x = -815.99,
        y = -1357.3,
        z = 5.15,
        rotation = 309.49,
        networkSync = true,
    },
}

Config.Licenses = {
    ["car"] = {
        vehicle = {
            modelHash = "dilettante2",
            spawnPoints = {
                vector4(-809.18, -1319.61, 4.49, 170.42),
                vector4(-814.58, -1296.18, 4.65, 170.07),
                vector4(-798.43, -1315.28, 4.65, 351.13),
                vector4(-817.49, -1311.57, 4.49, 350.02),
                vector4(-808.2, -1297.81, 4.49, 170.29),
                vector4(-791.33, -1293.64, 4.49, 350.16),
                vector4(-811.17, -1312.57, 4.49, 349.04),
                vector4(-804.08, -1291.58, 4.49, 351.07),
                vector4(-786.28, -1301.15, 4.49, 173.05),
                vector4(-798.86, -1299.54, 4.49, 169.81),
                vector4(-810.36, -1290.87, 4.49, 350.15),
                vector4(-745.45, -1313.55, 4.49, 49.7),
            },
            networkSync = true,
        },
        price = 1,
        icon = "c:driving-school/voiture.png",
        label = "Permis voiture ($%s)",
        points = 12,
    },
    ["truck"] = {
        vehicle = {
            modelHash = "boxville4",
            spawnPoints = {
                vector4(-828.87, -1264.37, 4.57, 139.59),
                vector4(-853.91, -1257.2, 4.9, 229.32),
                vector4(-807.63, -1276.53, 4.9, 171.22),
                vector4(-785.54, -1280.2, 4.9, 169.75),
                vector4(-848.95, -1274.45, 4.9, 300.18),
                vector4(-737.99, -1303.16, 4.9, 50.94),
                vector4(-781.97, -1295.58, 4.9, 349.38),
                vector4(-794.9, -1278.47, 4.9, 169.72),
                vector4(-775.98, -1281.71, 4.9, 170.89),
                vector4(-817.01, -1274.66, 4.9, 170.51),
                vector4(-857.07, -1267.6, 4.9, 301.25),
                vector4(-816.74, -1289.1, 4.9, 350.28),
            },
            networkSync = true,
        },
        price = 1,
        icon = "c:driving-school/camion.png",
        label = "Permis camion ($%s)",
        points = 12,
    },
    ["motorcycle"] = {
        vehicle = {
            modelHash = "faggio",
            spawnPoints = {
                vector4(-805.25, -1336.23, 4.62, 315.04),
                vector4(-780.41, -1341.65, 4.63, 7.65),
                vector4(-833.34, -1331.21, 4.63, 320.92),
                vector4(-765.9, -1336.77, 4.64, 51.54),
                vector4(-796.52, -1337.86, 4.63, 19.72),
                vector4(-763.39, -1304.49, 4.63, 8.31),
                vector4(-770.51, -1342.66, 4.64, 44.23),
                vector4(-802.66, -1319.68, 4.48, 169.33),
                vector4(-792.86, -1301.13, 4.48, 169.49),
                vector4(-804.82, -1312.5, 4.48, 349.23),
                vector4(-724.88, -1298.75, 4.48, 50.02),
                vector4(-775.24, -1347.36, 4.63, 9.47),
            },
            networkSync = true,
        },
        price = 1,
        icon = "c:driving-school/moto.png",
        label = "Permis moto ($%s)",
        points = 12,
    },
}

Config.VehiclePlateText = "P3RM15"

Config.PenaltyTickDelay = 200 -- in ms
Config.PenaltyMaxDuration = 4000 -- in ms
Config.NotificationDelay = Config.PenaltyMaxDuration -- in ms

Config.CheckpointType = 0
Config.CheckpointSize = 3.0
Config.CheckpointColor = {r = 12, g = 123, b = 86, a = 150}

Config.InstructorStartSpeech = {
    {
        ["car"] = "Ton examen va débuter. Boucle ta ceinture et nous pouvons partir.",
        ["truck"] = "Ton examen va débuter. Boucle ta ceinture et nous pouvons partir.",
    },
    "Suis ton GPS à allure modérée, et respecte les autres usagers de la route.",
}

Config.CheckpointCount = 6 -- Number of checkpoints during exam (including final checkpoint)
Config.Checkpoints = {
    {
        x = -606.1,
        y = -957.79,
        z = 20.39,
        message = "Ici, ce sont les bureaux de ~p~Twitch News~s~. Ils ne racontent que des salades…",
    },
    {x = 31.24, y = -767.01, z = 42.67, message = "Connaissez-vous Stonks Depository ?"},
    {
        x = 248.3,
        y = -369.19,
        z = 42.89,
        message = "T'auras besoin de ton permis si tu veux un job du Pole emploi, alors concentre-toi !",
    },
    {x = 667.22, y = -27.01, z = 80.96, message = "LSPD Vinewood. Au premier excès de vitesse, tu finis ici !"},
    {x = 204.08, y = 195.72, z = 104.01, message = "La Pacific Bank. Je crois que c'est ici qu'ils rendent l'argent."},
    {
        x = 807.06,
        y = -1290.38,
        z = 24.72,
        message = "LSPD, La Mesa. C'est cette patrouille autoroutière qui te coinceras si tu fais n'importe quoi…",
    },
    {x = 305.58, y = -1367.15, z = 30.44, message = "Les mauvais conducteurs finissent souvent ici, à l'Hôpital !"},
    {
        x = 506.42,
        y = -1306.97,
        z = 27.76,
        message = "Ta maman ne sera pas fière si tu dois venir chercher ta voiture à cette fourrière…",
    },
    {x = -222.02, y = -2053.33, z = 26.06, message = "L'affiche dit : \"Maze Bank Arena, le 4 juin 2022\""},
    {x = -1028.3, y = -871.1, z = 5.83, message = "Los Santos Police Department ! De chouettes types !"},
    {x = -696.01, y = 40.51, z = 41.56, message = "Kifflom !"},
    {
        x = -1379.76,
        y = 55.13,
        z = 52.04,
        message = "Tu essayes de m'acheter avec une partie de golf ?! Dommage je n'ai pas mes clubs…",
    },
    {x = 399.83, y = -981.8, z = 27.77, message = "Le LSPD surveille tous les conducteurs. Regarde la route !"},
    {
        x = -262.13,
        y = -1310.05,
        z = 29.65,
        message = "Benny's ! J'ai le sentiment que tu vas passer beaucoup de temps ici !",
    },
    {
        x = -1601.2,
        y = 156.95,
        z = 58.05,
        message = "Pfff! Regarde-moi tous ces étudiants qui passent leur vie sur les jeux-vidéos…",
    },
    {
        x = -86.89,
        y = -1101.69,
        z = 24.46,
        message = "Termine cet examen avant de lorgner sur le concessionnaire. Chaque chose en son temps.",
    },
    {
        x = -552.76,
        y = -151.6,
        z = 36.62,
        message = "Il paraît que c'est dans ce commisariat qu'il y a les meilleurs donuts.",
    },
}

Config.FinalCheckpointLandVehicle = {
    x = -763.07,
    y = -1322.39,
    z = 3.42,
    message = "Tu es arrivé au bout. Bien joué !",
}
Config.FinalCheckpoints = {
    ["car"] = Config.FinalCheckpointLandVehicle,
    ["truck"] = Config.FinalCheckpointLandVehicle,
    ["motorcycle"] = Config.FinalCheckpointLandVehicle,
}

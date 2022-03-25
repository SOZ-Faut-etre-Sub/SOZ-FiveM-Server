SozJobCore = {}

SozJobCore.JobType = {
    Unemployed = "unemployed",
    Adsl = "adsl",
    Delivery = "delivery",
    Religious = "religious",
    Scrapper = "scrapper",
    LSPD = "lspd",
    BCSO = "bcso",
    Medic = "medic",
    Taxi = "taxi",
    Food = "food",
    News = "news",
    Garbage = "garbage",
    Oil = "oil",
    CashTransfer = "cash-transfer",
    Bennys = "bennys",
    Debug = "debug",
}

SozJobCore.JobPermission = {ManageGrade = "manage-grade", SocietyPrivateStorage = "society-private-storage"}

SozJobCore.Jobs = {
    [SozJobCore.JobType.Unemployed] = {label = "Chomeur", grades = {}, permissions = {}},
    [SozJobCore.JobType.Adsl] = {
        label = "Adsl",
        temporary = {
            payout = 25,
            vehicule_position = {x = 500.79, y = -105.88, z = 62.07, w = 253.78},
            points = {
                {x = 406.88, y = -968.05, z = 29.45, sx = 1.8, sy = 1.2, heading = 358, minZ = 27.8, maxZ = 30.4},
                {x = -245.4, y = -705.67, z = 33.57, sx = 1.8, sy = 0.8, heading = 343, minZ = 32.17, maxZ = 34.17},
                {x = -588.54, y = -225.87, z = 36.43, sx = 1.6, sy = 1.2, heading = 29, minZ = 35.03, maxZ = 37.43},
                {x = -613.4, y = -942.67, z = 21.96, sx = 2.0, sy = 0.6, heading = 0, minZ = 20.36, maxZ = 22.56},
                {x = 353.33, y = -1350.68, z = 32.87, sx = 0.8, sy = 1.8, heading = 320, minZ = 31.27, maxZ = 32.67},
                {x = -738.09, y = -638.77, z = 30.33, sx = 1.75, sy = 0.6, heading = 0, minZ = 28.93, maxZ = 30.53},
                {x = -566.75, y = -356.01, z = 35.06, sx = 1.0, sy = 1.6, heading = 1, minZ = 33.86, maxZ = 36.06},
                {x = -298.36, y = -154.46, z = 41.33, sx = 1.6, sy = 0.6, heading = 358, minZ = 19.93, maxZ = 41.73},
            },
        },
        grades = {},
        permissions = {},
    },
    [SozJobCore.JobType.Delivery] = {
        label = "Livraison",
        temporary = {
            payout = 25,
            vehicule_position = {x = -413.45, y = -2791.54, z = 7.0, w = 317.52},
            points = {
                {x = 859.15, y = -531.95, z = 57.33, sx = 1, sy = 1, heading = 0, minZ = 56.08, maxZ = 58.08},
                {x = -1225.8, y = -1094.27, z = 8.17, sx = 1, sy = 1, heading = 0, minZ = 6.77, maxZ = 8.57},
                {x = -618.08, y = -950.34, z = 21.7, sx = 1, sy = 1, heading = 0, minZ = 20.5, maxZ = 21.9},
                {x = -822.38, y = -995.39, z = 13.07, sx = 1, sy = 1, heading = 29, minZ = 12.27, maxZ = 14.07},
                {x = -1365.82, y = -686.5, z = 25.32, sx = 1, sy = 1, heading = 37, minZ = 23.72, maxZ = 25.32},
            },
        },
        grades = {},
        permissions = {},
    },
    [SozJobCore.JobType.Religious] = {
        label = "Religion",
        temporary = {
            payout = 150,
            vehicule_position = {x = -763.69, y = -39.26, z = 37.69, w = 119.87},
            points = {
                {x = -1517.37, y = -433.94, z = 63.06, sx = 45.4, sy = 53.8, heading = 49, minZ = 34.46, maxZ = 43.46},
                {x = 235.83, y = 235.83, z = 37.57, sx = 45.8, sy = 54.0, heading = 340, minZ = 26.77, maxZ = 34.17},
                {x = -1221.01, y = -1546.34, z = 18.48, sx = 48.8, sy = 76.6, heading = 305, minZ = 3.08, maxZ = 7.08},
            },
        },
        grades = {},
        permissions = {},
    },
    [SozJobCore.JobType.Scrapper] = {
        label = "Métallurgie",
        temporary = {
            payout = 5,
            vehicule_position = {x = -346.18, y = -1569.38, z = 25.23, w = 17.67},
            points = {
                {x = -454.83, y = -1678.6, z = 19.03, sx = 4.2, sy = 2.4, heading = 336, minZ = 17.83, maxZ = 19.83},
                {x = -443.72, y = -1676.47, z = 19.03, sx = 2.25, sy = 4.0, heading = 340, minZ = 17.28, maxZ = 19.88},
                {x = -474.17, y = -1677.17, z = 19.0, sx = 2.8, sy = 2.2, heading = 335, minZ = 17.4, maxZ = 19.4},
                {x = -474.31, y = -1680.6, z = 19.03, sx = 2.2, sy = 3.0, heading = 337, minZ = 17.63, maxZ = 19.63},
                {x = -475.62, y = -1729.28, z = 18.69, sx = 2.4, sy = 4.4, heading = 14, minZ = 17.49, maxZ = 19.49},
            },
        },
        grades = {},
        permissions = {},
    },
    [SozJobCore.JobType.LSPD] = {
        label = "LSPD",
        grades = {},
        menuCallback = "police:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
        },
    },
    [SozJobCore.JobType.BCSO] = {
        label = "BCSO",
        grades = {},
        menuCallback = "police:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
        },
    },
    [SozJobCore.JobType.Medic] = {
        label = "Médécin",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.Taxi] = {
        label = "Taxi",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.Food] = {
        label = "Food & Drink",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.News] = {
        label = "Twitch News",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.Garbage] = {
        label = "Eboueur",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.Oil] = {
        label = "Pompiste",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.CashTransfer] = {
        label = "Transport de fond",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.Bennys] = {
        label = "Méchanicien",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
    [SozJobCore.JobType.Debug] = {
        label = "Debug job",
        grades = {},
        permissions = {[SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"}},
    },
}

SozJobCore.adsl_payout = 25
SozJobCore.adsl_vehicule = {x = 500.79, y = -105.88, z = 62.07, w = 253.78}

SozJobCore.livraison_payout = 25
SozJobCore.livraison_vehicule = {x = -413.45, y = -2791.54, z = 7.0, w = 317.52}

SozJobCore.religion_payout = 150
SozJobCore.religion_vehicule = {x = -763.69, y = -39.26, z = 37.69, w = 119.87}

SozJobCore.metal_payout = 5
SozJobCore.metal_vehicule = {x = -346.18, y = -1569.38, z = 25.23, w = 17.67}

SozJobCore.adsl = {
    {x = 406.88, y = -968.05, z = 29.45, sx = 1.8, sy = 1.2, heading = 358, minZ = 27.8, maxZ = 30.4},
    {x = -245.4, y = -705.67, z = 33.57, sx = 1.8, sy = 0.8, heading = 343, minZ = 32.17, maxZ = 34.17},
    {x = -588.54, y = -225.87, z = 36.43, sx = 1.6, sy = 1.2, heading = 29, minZ = 35.03, maxZ = 37.43},
    {x = -613.4, y = -942.67, z = 21.96, sx = 2.0, sy = 0.6, heading = 0, minZ = 20.36, maxZ = 22.56},
    {x = 353.33, y = -1350.68, z = 32.87, sx = 0.8, sy = 1.8, heading = 320, minZ = 31.27, maxZ = 32.67},
    {x = -738.09, y = -638.77, z = 30.33, sx = 1.75, sy = 0.6, heading = 0, minZ = 28.93, maxZ = 30.53},
    {x = -566.75, y = -356.01, z = 35.06, sx = 1.0, sy = 1.6, heading = 1, minZ = 33.86, maxZ = 36.06},
    {x = -298.36, y = -154.46, z = 41.33, sx = 1.6, sy = 0.6, heading = 358, minZ = 19.93, maxZ = 41.73},
}

SozJobCore.livraison = {
    {x = 859.15, y = -531.95, z = 57.33, sx = 1, sy = 1, heading = 0, minZ = 56.08, maxZ = 58.08},
    {x = -1225.8, y = -1094.27, z = 8.17, sx = 1, sy = 1, heading = 0, minZ = 6.77, maxZ = 8.57},
    {x = -618.08, y = -950.34, z = 21.7, sx = 1, sy = 1, heading = 0, minZ = 20.5, maxZ = 21.9},
    {x = -822.38, y = -995.39, z = 13.07, sx = 1, sy = 1, heading = 29, minZ = 12.27, maxZ = 14.07},
    {x = -1365.82, y = -686.5, z = 25.32, sx = 1, sy = 1, heading = 37, minZ = 23.72, maxZ = 25.32},
}

SozJobCore.religion = {
    {x = -1517.37, y = -433.94, z = 63.06, sx = 45.4, sy = 53.8, heading = 49, minZ = 34.46, maxZ = 43.46},
    {x = 235.83, y = 235.83, z = 37.57, sx = 45.8, sy = 54.0, heading = 340, minZ = 26.77, maxZ = 34.17},
    {x = -1221.01, y = -1546.34, z = 18.48, sx = 48.8, sy = 76.6, heading = 305, minZ = 3.08, maxZ = 7.08},
}

SozJobCore.metal = {
    {x = -454.83, y = -1678.6, z = 19.03, sx = 4.2, sy = 2.4, heading = 336, minZ = 17.83, maxZ = 19.83},
    {x = -443.72, y = -1676.47, z = 19.03, sx = 2.25, sy = 4.0, heading = 340, minZ = 17.28, maxZ = 19.88},
    {x = -474.17, y = -1677.17, z = 19.0, sx = 2.8, sy = 2.2, heading = 335, minZ = 17.4, maxZ = 19.4},
    {x = -474.31, y = -1680.6, z = 19.03, sx = 2.2, sy = 3.0, heading = 337, minZ = 17.63, maxZ = 19.63},
    {x = -475.62, y = -1729.28, z = 18.69, sx = 2.4, sy = 4.4, heading = 14, minZ = 17.49, maxZ = 19.49},
}

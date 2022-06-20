SozJobCore = {}

SozJobCore.JobType = {
    Unemployed = "unemployed",
    FBI = "fbi",
    Adsl = "adsl",
    Delivery = "delivery",
    Religious = "religious",
    Scrapper = "scrapper",
    LSPD = "lspd",
    BCSO = "bcso",
    LSMC = "lsmc",
    Taxi = "taxi",
    Food = "food",
    News = "news",
    Garbage = "garbage",
    Oil = "oil",
    CashTransfer = "cash-transfer",
    Bennys = "bennys",
    Upw = "upw",
    Pawl = "pawl",
    Debug = "debug",
}

SozJobCore.JobPermission = {
    Enrollment = "enrollment",
    ManageGrade = "manage-grade",
    SocietyDealershipVehicle = "society-dealership-vehicle",
    SocietyPrivateStorage = "society-private-storage",
    SocietyShop = "society-shop",
    SocietyBankAccount = "society-bank-account",
    SocietyBankInvoices = "society-bank-invoices",
    SocietyTakeOutPound = "society-take-out-pound",
    NewsManageArticle = "manage-article",
    CashTransfer = {CollectBags = "collect-bags", ResaleBags = "resale-bags", FillIn = "fill-in"},
    Food = {Harvest = "harvest", Craft = "craft"},
}

SozJobCore.Jobs = {
    [SozJobCore.JobType.Unemployed] = {label = "Sans emploi", grades = {}, permissions = {}},
    [SozJobCore.JobType.Adsl] = {
        label = "ADSL",
        platePrefix = "ADSL",
        temporary = {
            payout = 6,
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
        label = "Fougère Prime",
        platePrefix = "FOUG",
        temporary = {
            payout = 5,
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
        label = "InfoChat",
        platePrefix = "INFO",
        temporary = {
            payout = 6,
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
        label = "DeMetal Company",
        platePrefix = "DEMC",
        temporary = {
            payout = 1,
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
    [SozJobCore.JobType.FBI] = {
        label = "Federal Bureau of Investigation",
        platePrefix = " FBI",
        grades = {},
        menuCallback = "police:client:OpenSocietyMenu",
        permissions = {},
    },
    [SozJobCore.JobType.LSPD] = {
        label = "Los Santos Police Department",
        platePrefix = "LSPD",
        grades = {},
        menuCallback = "police:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyShop] = {label = "Accès aux magasins de société"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.BCSO] = {
        label = "Blaine County Sheriff Office",
        platePrefix = "BCSO",
        grades = {},
        menuCallback = "police:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyShop] = {label = "Accès aux magasins de société"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.LSMC] = {
        label = "Los Santos Medical Center",
        platePrefix = "LSMC",
        grades = {},
        menuCallback = "lsmc:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyShop] = {label = "Accès aux magasins de société"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.Taxi] = {
        label = "Carl Jr Service",
        platePrefix = "CARL",
        grades = {},
        menuCallback = "taxi:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.Food] = {
        label = "Château Marius",
        platePrefix = "CHAT",
        grades = {},
        menuCallback = "jobs:client:food:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.Food.Harvest] = {label = "Récolter des ingrédients"},
            [SozJobCore.JobPermission.Food.Craft] = {label = "Cuisiner"},
            [SozJobCore.JobPermission.SocietyShop] = {label = "Accès aux magasins de société"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
        resell = {
            coords = vector4(-57.01, -2448.4, 7.24, 145.77), -- Must be vec4
            ZoneName = "Resell:LSPort:Food",
            SourceAccount = "farm_food",
            TargetAccount = "safe_food",
        },
    },
    [SozJobCore.JobType.News] = {
        label = "Twitch News",
        platePrefix = "NEWS",
        grades = {},
        menuCallback = "jobs:client:news:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyShop] = {label = "Accès aux magasins de société"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
            [SozJobCore.JobPermission.NewsManageArticle] = {label = "Gérer les articles sur le site"},
        },
    },
    [SozJobCore.JobType.Garbage] = {
        label = "BlueBird",
        platePrefix = "BLUE",
        grades = {},
        menuCallback = "jobs:client:garbage:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.Oil] = {
        label = "Michel Transport Petrol",
        platePrefix = "MITP",
        grades = {},
        menuCallback = "jobs:client:fueler:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.CashTransfer] = {
        label = "STONK Depository",
        platePrefix = "STNK",
        grades = {},
        menuCallback = "stonk:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.CashTransfer.CollectBags] = {label = "Collecte sacs d'argent"},
            [SozJobCore.JobPermission.CashTransfer.ResaleBags] = {label = "Déposer sacs d'argent"},
            [SozJobCore.JobPermission.CashTransfer.FillIn] = {label = "Remplir banque / ATM"},
            [SozJobCore.JobPermission.SocietyShop] = {label = "Accès aux magasins de société"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.Bennys] = {
        label = "Benny's",
        platePrefix = "BENY",
        grades = {},
        menuCallback = "bennys:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyShop] = {label = "Accès aux magasins de société"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.Upw] = {
        label = "Unexpected Power & Water",
        platePrefix = "UPW",
        grades = {},
        menuCallback = "",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
    },
    [SozJobCore.JobType.Pawl] = {
        label = "Pipe And Wooden Leg",
        platePrefix = "PAWL",
        grades = {},
        menuCallback = "pawl:client:OpenSocietyMenu",
        permissions = {
            [SozJobCore.JobPermission.Enrollment] = {label = "Gestion des recrutements"},
            [SozJobCore.JobPermission.ManageGrade] = {label = "Gestion des grades"},
            [SozJobCore.JobPermission.SocietyBankAccount] = {label = "Accès au compte société"},
            [SozJobCore.JobPermission.SocietyBankInvoices] = {label = "Accès aux outils de facturation société"},
            [SozJobCore.JobPermission.SocietyPrivateStorage] = {label = "Accès aux stockages société privés"},
            [SozJobCore.JobPermission.SocietyDealershipVehicle] = {label = "Accès aux concessionnaires de véhicules"},
            [SozJobCore.JobPermission.SocietyTakeOutPound] = {label = "Sortir les véhicules de la fourrière"},
        },
        resell = {
            primary = {
                coords = vector4(-272.22, -2496.57, 7.3, 186.72), -- Must be vec4
                ZoneName = "Resell:LSPort:Pawl",
                SourceAccount = "farm_pawl",
                TargetAccount = "safe_pawl",
            },
            secondary = {ZoneName = "Resell:Zkea", SourceAccount = "farm_pawl", TargetAccount = "safe_pawl"},
        },
    },
    [SozJobCore.JobType.Debug] = {label = "Debug job", grades = {}, permissions = {}},
}

SozJobCore.adsl_payout = 6
SozJobCore.adsl_vehicule = {x = 500.79, y = -105.88, z = 62.07, w = 253.78}

SozJobCore.livraison_payout = 5
SozJobCore.livraison_vehicule = {x = -413.45, y = -2791.54, z = 7.0, w = 317.52}

SozJobCore.religion_payout = 6
SozJobCore.religion_vehicule = {x = -763.69, y = -39.26, z = 37.69, w = 119.87}
SozJobCore.religion_prayers_range = {min = 3, max = 6}

SozJobCore.metal_payout = 1
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
    {x = 235.83, y = 235.83, z = 105.5, sx = 45.8, sy = 54.0, heading = 340, minZ = 104.0, maxZ = 110.0},
    {x = -1221.01, y = -1546.34, z = 18.48, sx = 48.8, sy = 76.6, heading = 305, minZ = 3.08, maxZ = 7.08},
}

SozJobCore.metal = {
    {x = -454.83, y = -1678.6, z = 19.03, sx = 4.2, sy = 2.4, heading = 336, minZ = 17.83, maxZ = 19.83},
    {x = -443.72, y = -1676.47, z = 19.03, sx = 2.25, sy = 4.0, heading = 340, minZ = 17.28, maxZ = 19.88},
    {x = -474.17, y = -1677.17, z = 19.0, sx = 2.8, sy = 2.2, heading = 335, minZ = 17.4, maxZ = 19.4},
    {x = -474.31, y = -1680.6, z = 19.03, sx = 2.2, sy = 3.0, heading = 337, minZ = 17.63, maxZ = 19.63},
    {x = -475.62, y = -1729.28, z = 18.69, sx = 2.4, sy = 4.4, heading = 14, minZ = 17.49, maxZ = 19.49},
}

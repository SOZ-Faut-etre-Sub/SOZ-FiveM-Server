Config = {}

Config.AllowedJobInteraction = {"fbi", "lspd", "bcso"}
Config.AllowedJobDragInteraction = {"fbi", "lspd", "bcso", "lsmc", "cash-transfer"}

Config.Badge = GetHashKey("prop_fib_badge")

Config.Locations = {
    ["stations"] = {
        ["LSPD"] = {label = "Los Santos Police Department", blip = {sprite = 60}, coords = vector3(632.76, 7.31, 82.63)},
        ["BCSO"] = {
            label = "Blaine County Sheriff's Office",
            blip = {sprite = 137},
            coords = vector3(1856.15, 3681.68, 34.27),
        },
    },
}

--- Licenses
Config.Licenses = {
    ["car"] = {label = "Permis voiture"},
    ["truck"] = {label = "Permis poids lourd"},
    ["motorcycle"] = {label = "Permis moto"},
    ["heli"] = {label = "Permis d'aviation"},
    ["boat"] = {label = "Permis maritime"},
    ["weapon"] = {label = "Permis port d'arme"},
    ["hunting"] = {label = "Permis de chasse"},
    ["fishing"] = {label = "Permis de pêche"},
    ["rescuer"] = {label = "Secouriste"},
}

Config.SirenVehicle = {
    [GetHashKey("ambulance")] = true,
    [GetHashKey("ambcar")] = true,
    [GetHashKey("firetruk")] = true,
    --- LSPD
    [GetHashKey("police")] = true,
    [GetHashKey("police2")] = true,
    [GetHashKey("police3")] = true,
    [GetHashKey("police4")] = true,
    [GetHashKey("police5")] = true,
    [GetHashKey("police6")] = true,
    [GetHashKey("policeb2")] = true,
    [GetHashKey("lspdbana1")] = true,
    [GetHashKey("lspdbana2")] = true,
    --- BCSO
    [GetHashKey("sheriff")] = true,
    [GetHashKey("sheriff2")] = true,
    [GetHashKey("sheriff3")] = true,
    [GetHashKey("sheriff4")] = true,
    [GetHashKey("sheriffb")] = true,
    [GetHashKey("sheriffdodge")] = true,
    [GetHashKey("sheriffcara")] = true,
    [GetHashKey("bcsobana1")] = true,
    [GetHashKey("bcsobana2")] = true,
    --- LSPD / BCSO
    [GetHashKey("pbus")] = true,
    --- FBI
    [GetHashKey("fbi")] = true,
    [GetHashKey("fbi2")] = true,
    [GetHashKey("cogfbi")] = true,
    [GetHashKey("paragonfbi")] = true,
}
--- Fines
Config.Fines = {
    ["lspd"] = {
        [1] = {
            label = "Catégorie 1",
            items = {
                {label = "Conduite sans permis", price = 500},
                {label = "Dégradation de bien public", price = 750},
                {label = "Insulte/outrage", price = 1000},
                {label = "Infraction au code de la route", price = 100},
                {label = "Infraction au code de la route aggravé", price = 200},
                {label = "Rappel à la loi", price = 100},
                {label = "Rappel à la loi aggravé", price = 250},
                {label = "Violation de propriété privée", price = 2500},
            },
        },
        [2] = {
            label = "Catégorie 2",
            items = {
                {label = "Coups et blessures", price = {min = 2500, max = 10000}},
                {label = "Détention d'objets prohibés", price = 250},
                {label = "Détention d'objets prohibés aggravée", price = 1000},
                {label = "Détention de matériel militaire", price = 10000},
                {label = "Détention de matériel militaire aggravée", price = 15000},
                {label = "Menace", price = {min = 1000, max = 10000}},
                {label = "Obstruction à la justice", price = 1000},
                {label = "Port d'arme sans permis", price = 10000},
                {label = "Refus d'obtempérer/délit de fuite", price = 500},
                {label = "Vol/racket", price = {min = 500, max = 20000}},
            },
        },
        [3] = {
            label = "Catégorie 3",
            items = {
                {label = "Agression à main armée", price = {min = 20000, max = 50000}},
                {label = "Enlèvement", price = {min = 20000, max = 50000}},
                {label = "Menace à main armée", price = {min = 10000, max = 30000}},
            },
        },
        [4] = {
            label = "Catégorie 4",
            items = {
                {label = "Homicide involontaire", price = {min = 50000, max = 75000}},
                {label = "Prise d'otage", price = {min = 30000, max = 50000}},
            },
        },
    },
    ["bcso"] = {
        [1] = {
            label = "Catégorie 1",
            items = {
                {label = "Conduite sans permis", price = 500},
                {label = "Dégradation de bien public", price = 750},
                {label = "Insulte/outrage", price = 1000},
                {label = "Infraction au code de la route", price = 100},
                {label = "Infraction au code de la route aggravé", price = 200},
                {label = "Rappel à la loi", price = 100},
                {label = "Rappel à la loi aggravé", price = 250},
                {label = "Violation de propriété privée", price = 2500},
            },
        },
        [2] = {
            label = "Catégorie 2",
            items = {
                {label = "Coups et blessures", price = {min = 2500, max = 10000}},
                {label = "Détention d'objets prohibés", price = 250},
                {label = "Détention d'objets prohibés aggravée", price = 1000},
                {label = "Détention de matériel militaire", price = 10000},
                {label = "Détention de matériel militaire aggravée", price = 15000},
                {label = "Menace", price = {min = 1000, max = 10000}},
                {label = "Obstruction à la justice", price = 1000},
                {label = "Port d'arme sans permis", price = 10000},
                {label = "Refus d'obtempérer/délit de fuite", price = 500},
                {label = "Vol/racket", price = {min = 500, max = 20000}},
            },
        },
        [3] = {
            label = "Catégorie 3",
            items = {
                {label = "Agression à main armée", price = {min = 20000, max = 50000}},
                {label = "Enlèvement", price = {min = 20000, max = 50000}},
                {label = "Menace à main armée", price = {min = 10000, max = 30000}},
            },
        },
        [4] = {
            label = "Catégorie 4",
            items = {
                {label = "Homicide involontaire", price = {min = 50000, max = 75000}},
                {label = "Prise d'otage", price = {min = 30000, max = 50000}},
            },
        },
    },
}

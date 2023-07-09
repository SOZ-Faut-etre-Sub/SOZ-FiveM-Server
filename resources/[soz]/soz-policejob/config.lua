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
    [GetHashKey("lspdgallardo")] = true,
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
    [GetHashKey("bcsoc7")] = true,
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
                {label = "Rappel à la loi", price = {min = 150, max = 450}},
                {label = "Infraction aux règles de circulation", price = {min = 200, max = 600}},
                {label = "Permis ou licence manquant", price = {min = 300, max = 900}},
                {label = "Participation à un événement illégal ", price = {min = 450, max = 1350}},
                {label = "Vol ou extorsion", price = {min = 500, max = 1500}},
                {label = "Dégradation de bien privé", price = {min = 500, max = 1500}},
                {label = "Trouble à l'ordre publique", price = {min = 500, max = 1500}},
                {label = "Braconnage ou commerce illégal", price = {min = 600, max = 1800}},
                {label = "Insulte ou outrage", price = {min = 600, max = 1800}},
            },
        },
        [2] = {
            label = "Catégorie 2",
            items = {
                {label = "Détention d'objet prohibé", price = {min = 700, max = 2100}},
                {label = "Délit de fuite", price = {min = 800, max = 2400}},
                {label = "Violation de propriété privée", price = {min = 850, max = 2550}},
                {label = "Dégradation de bien public", price = {min = 1000, max = 3000}},
                {label = "Port d'arme illégal", price = {min = 1000, max = 3000}},
                {label = "Menace ou Attaque", price = {min = 1200, max = 3600}},
                {label = "Braquage de commerce local", price = {min = 1500, max = 4500}},
                {label = "Mise en danger d'autrui", price = {min = 1500, max = 4500}},
            },
        },
        [3] = {
            label = "Catégorie 3",
            items = {
                {label = "Obstruction à la justice", price = {min = 1750, max = 5700}},
                {label = "Divulgation d'info Confidentielle", price = {min = 2000, max = 6000}},
                {label = "Détention de matériel militaire prohibé", price = {min = 2500, max = 7500}},
                {label = "Menace à main armée", price = {min = 2500, max = 7500}},
                {label = "Attaque à main armée", price = {min = 3500, max = 10500}},
                {label = "Tentative d'enlèvement", price = {min = 3500, max = 10500}},
            },
        },
        [4] = {
            label = "Catégorie 4",
            items = {
                {label = "Corruption", price = {min = 5000, max = 15000}},
                {label = "Enlèvement ou prise d'otage", price = {min = 6000, max = 18000}},
                {label = "Violation de serment", price = {min = 8000, max = 24000}},
                {label = "Homicide", price = {min = 10000, max = 30000}},
                {label = "Perturbation de San Andreas", price = {min = 10000, max = 30000}},
            },
        },
    },
    ["bcso"] = {
        [1] = {
            label = "Catégorie 1",
            items = {
                {label = "Rappel à la loi", price = {min = 150, max = 450}},
                {label = "Infraction aux règles de circulation", price = {min = 200, max = 600}},
                {label = "Permis ou licence manquant", price = {min = 300, max = 900}},
                {label = "Participation à un événement illégal ", price = {min = 450, max = 1350}},
                {label = "Vol ou extorsion", price = {min = 500, max = 1500}},
                {label = "Dégradation de bien privé", price = {min = 500, max = 1500}},
                {label = "Trouble à l'ordre publique", price = {min = 500, max = 1500}},
                {label = "Braconnage ou commerce illégal", price = {min = 600, max = 1800}},
                {label = "Insulte ou outrage", price = {min = 600, max = 1800}},
            },
        },
        [2] = {
            label = "Catégorie 2",
            items = {
                {label = "Détention d'objet prohibé", price = {min = 700, max = 2100}},
                {label = "Délit de fuite", price = {min = 800, max = 2400}},
                {label = "Violation de propriété privée", price = {min = 850, max = 2550}},
                {label = "Dégradation de bien public", price = {min = 1000, max = 3000}},
                {label = "Port d'arme illégal", price = {min = 1000, max = 3000}},
                {label = "Menace ou Attaque", price = {min = 1200, max = 3600}},
                {label = "Braquage de commerce local", price = {min = 1500, max = 4500}},
                {label = "Mise en danger d'autrui", price = {min = 1500, max = 4500}},
            },
        },
        [3] = {
            label = "Catégorie 3",
            items = {
                {label = "Obstruction à la justice", price = {min = 1750, max = 5700}},
                {label = "Divulgation d'info Confidentielle", price = {min = 2000, max = 6000}},
                {label = "Détention de matériel militaire prohibé", price = {min = 2500, max = 7500}},
                {label = "Menace à main armée", price = {min = 2500, max = 7500}},
                {label = "Attaque à main armée", price = {min = 3500, max = 10500}},
                {label = "Tentative d'enlèvement", price = {min = 3500, max = 10500}},
            },
        },
        [4] = {
            label = "Catégorie 4",
            items = {
                {label = "Corruption", price = {min = 5000, max = 15000}},
                {label = "Enlèvement ou prise d'otage", price = {min = 6000, max = 18000}},
                {label = "Violation de serment", price = {min = 8000, max = 24000}},
                {label = "Homicide", price = {min = 10000, max = 30000}},
                {label = "Perturbation de San Andreas", price = {min = 10000, max = 30000}},
            },
        },
    },
}

Config = {}

Config.AllowedJobInteraction = {"fbi", "lspd", "bcso"}
Config.AllowedJobDragInteraction = {"fbi", "lspd", "bcso", "lsmc", "cash-transfer"}

Config.Badge = GetHashKey("prop_fib_badge")

Config.Locations = {
    ["stations"] = {
        ["LSPD"] = {label = "Los Santos Police Department", blip = {sprite = 60}, coords = vector3(632.76, 7.31, 82.63)},
        ["BCSO"] = {
            label = "Blaine Country Sheriff's Office",
            blip = {sprite = 137},
            coords = vector3(1856.15, 3681.68, 34.27),
        },
    },
}

Config.Cloakroom = {
    ["lspd"] = {
        [GetHashKey("mp_m_freemode_01")] = {
            --[[ ["Tenue SWAT"] = {
                Components = {
                    [1] = {Drawable = 185, Texture = 0, Palette = 0},
                    [3] = {Drawable = 179, Texture = 0, Palette = 0},
                    [4] = {Drawable = 31, Texture = 0, Palette = 0},
                    [5] = {Drawable = 48, Texture = 0, Palette = 0},
                    [6] = {Drawable = 25, Texture = 0, Palette = 0},
                    [7] = {Drawable = 110, Texture = 0, Palette = 0},
                    [8] = {Drawable = 15, Texture = 0, Palette = 0},
                    [9] = {Drawable = 16, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 220, Texture = 0, Palette = 0},
                },
                Props = {
                    [0] = {Drawable = 150, Texture = 0, Palette = 0},
                    [1] = {Drawable = 21, Texture = 0, Palette = 0},
                },
            }, ]]
            ["Tenue de pilote"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 16, Texture = 0, Palette = 0},
                    [4] = {Drawable = 64, Texture = 0, Palette = 0},
                    [6] = {Drawable = 24, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 67, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 108, Texture = 0, Palette = 0},
                },
                Props = {[0] = {Drawable = 78, Texture = 1, Palette = 0}},
            },
            ["Tenue de moto"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 22, Texture = 0, Palette = 0},
                    [4] = {Drawable = 32, Texture = 1, Palette = 0},
                    [6] = {Drawable = 13, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 56, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 200, Texture = 1, Palette = 0},
                },
                Props = {[0] = {Drawable = 17, Texture = 1, Palette = 0}},
            },
        },
        [GetHashKey("mp_f_freemode_01")] = {
            --[[ ["Tenue SWAT"] = {
                Components = {
                    [1] = {Drawable = 185, Texture = 0, Palette = 0},
                    [3] = {Drawable = 215, Texture = 0, Palette = 0},
                    [4] = {Drawable = 30, Texture = 0, Palette = 0},
                    [5] = {Drawable = 48, Texture = 0, Palette = 0},
                    [6] = {Drawable = 25, Texture = 0, Palette = 0},
                    [7] = {Drawable = 81, Texture = 0, Palette = 0},
                    [8] = {Drawable = 15, Texture = 0, Palette = 0},
                    [9] = {Drawable = 18, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 230, Texture = 0, Palette = 0},
                },
                Props = {
                    [0] = {Drawable = 149, Texture = 0, Palette = 0},
                    [1] = {Drawable = 22, Texture = 0, Palette = 0},
                },
            }, ]]
            ["Tenue de pilote"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 17, Texture = 0, Palette = 0},
                    [4] = {Drawable = 66, Texture = 0, Palette = 0},
                    [6] = {Drawable = 24, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 49, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 99, Texture = 0, Palette = 0},
                },
                Props = {[0] = {Drawable = 77, Texture = 1, Palette = 0}},
            },
            ["Tenue de moto"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 3, Texture = 0, Palette = 0},
                    [4] = {Drawable = 31, Texture = 1, Palette = 0},
                    [6] = {Drawable = 34, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 33, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 202, Texture = 1, Palette = 0},
                },
                Props = {[0] = {Drawable = 17, Texture = 1, Palette = 0}},
            },
        },
    },
    ["bcso"] = {
        [GetHashKey("mp_m_freemode_01")] = {
            ["Tenue de pilote"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 96, Texture = 0, Palette = 0},
                    [4] = {Drawable = 64, Texture = 1, Palette = 0},
                    [6] = {Drawable = 24, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 43, Texture = 2, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 108, Texture = 1, Palette = 0},
                },
                Props = {[0] = {Drawable = 78, Texture = 2, Palette = 0}},
            },
            ["Tenue de moto"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 20, Texture = 0, Palette = 0},
                    [4] = {Drawable = 32, Texture = 2, Palette = 0},
                    [5] = {Drawable = 54, Texture = 0, Palette = 0},
                    [6] = {Drawable = 13, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 38, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 200, Texture = 3, Palette = 0},
                },
                Props = {[0] = {Drawable = 17, Texture = 3, Palette = 0}},
            },
        },
        [GetHashKey("mp_f_freemode_01")] = {
            ["Tenue de pilote"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 36, Texture = 0, Palette = 0},
                    [4] = {Drawable = 66, Texture = 1, Palette = 0},
                    [6] = {Drawable = 24, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 30, Texture = 2, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 99, Texture = 1, Palette = 0},
                },
                Props = {[0] = {Drawable = 77, Texture = 2, Palette = 0}},
            },
            ["Tenue de moto"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 0, Texture = 0, Palette = 0},
                    [4] = {Drawable = 31, Texture = 2, Palette = 0},
                    [5] = {Drawable = 54, Texture = 0, Palette = 0},
                    [6] = {Drawable = 34, Texture = 0, Palette = 0},
                    [7] = {Drawable = 0, Texture = 0, Palette = 0},
                    [8] = {Drawable = 33, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 202, Texture = 2, Palette = 0},
                },
                Props = {[0] = {Drawable = 17, Texture = 3, Palette = 0}},
            },
        },
    },
}

Config.DutyOutfit = {
    ["lspd"] = {
        [0] = { -- Cadet
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 11, Texture = 0, Palette = 0},
                    [4] = {Drawable = 35, Texture = 0, Palette = 0},
                    [5] = {Drawable = 52, Texture = 0, Palette = 0},
                    [6] = {Drawable = 51, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 56, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 190, Texture = 0, Palette = 0},
                },
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 9, Texture = 0, Palette = 0},
                    [4] = {Drawable = 34, Texture = 0, Palette = 0},
                    [5] = {Drawable = 52, Texture = 0, Palette = 0},
                    [6] = {Drawable = 52, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 33, Texture = 0, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 192, Texture = 0, Palette = 0},
                },
                Props = {},
            },
        },
        [78] = { -- Officier
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 15, Texture = 0, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 14, Texture = 0, Palette = 0}},
                Props = {},
            },
        },
        [77] = { -- Sergeant
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 15, Texture = 2, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 14, Texture = 2, Palette = 0}},
                Props = {},
            },
        },
        [76] = { -- Lieutenant
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 0, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 0, Palette = 0}},
                Props = {},
            },
        },
        [75] = { -- Captain
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 1, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 1, Palette = 0}},
                Props = {},
            },
        },
        [74] = { -- Commander
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 2, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 2, Palette = 0}},
                Props = {},
            },
        },
        [73] = { -- Deputy Chief
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 3, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 3, Palette = 0}},
                Props = {},
            },
        },
        [30] = { -- Chief of Police
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 5, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 5, Palette = 0}},
                Props = {},
            },
        },
    },
    ["bcso"] = {
        [0] = { -- Junior
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 11, Texture = 0, Palette = 0},
                    [4] = {Drawable = 22, Texture = 8, Palette = 0},
                    [5] = {Drawable = 54, Texture = 0, Palette = 0},
                    [6] = {Drawable = 51, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 38, Texture = 1, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 190, Texture = 3, Palette = 0},
                },
                Props = {[0] = {Drawable = 33, Texture = 1, Palette = 0}},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 9, Texture = 0, Palette = 0},
                    [4] = {Drawable = 3, Texture = 7, Palette = 0},
                    [5] = {Drawable = 54, Texture = 0, Palette = 0},
                    [6] = {Drawable = 52, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 51, Texture = 1, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 192, Texture = 2, Palette = 0},
                },
                Props = {[0] = {Drawable = 32, Texture = 1, Palette = 0}},
            },
        },
        [70] = { -- Senior
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 15, Texture = 7, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 14, Texture = 7, Palette = 0}},
                Props = {},
            },
        },
        [69] = { -- Major
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 15, Texture = 8, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 14, Texture = 8, Palette = 0}},
                Props = {},
            },
        },
        [68] = { -- Major Chief
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 6, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 6, Palette = 0}},
                Props = {},
            },
        },
        [67] = { -- Assistant Sheriff
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 7, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 7, Palette = 0}},
                Props = {},
            },
        },
        [66] = { -- Undersheriff
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 44, Texture = 9, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 52, Texture = 9, Palette = 0}},
                Props = {},
            },
        },
        [38] = { -- Sheriff
            [GetHashKey("mp_m_freemode_01")] = {
                Components = {[10] = {Drawable = 43, Texture = 0, Palette = 0}},
                Props = {},
            },
            [GetHashKey("mp_f_freemode_01")] = {
                Components = {[10] = {Drawable = 51, Texture = 0, Palette = 0}},
                Props = {},
            },
        },
    },
}

Config.PrisonerClothes = {
    [GetHashKey("mp_m_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 0, Texture = 0, Palette = 0},
            [4] = {Drawable = 3, Texture = 7, Palette = 0},
            [6] = {Drawable = 12, Texture = 12, Palette = 0},
            [7] = {Drawable = 0, Texture = 0, Palette = 0},
            [8] = {Drawable = 15, Texture = 0, Palette = 0},
            [9] = {Drawable = 0, Texture = 0, Palette = 0},
            [10] = {Drawable = 0, Texture = 0, Palette = 0},
            [11] = {Drawable = 146, Texture = 0, Palette = 0},
        },
        Props = {},
    },
    [GetHashKey("mp_f_freemode_01")] = {
        Components = {
            [1] = {Drawable = 0, Texture = 0, Palette = 0},
            [3] = {Drawable = 2, Texture = 0, Palette = 0},
            [4] = {Drawable = 3, Texture = 15, Palette = 0},
            [6] = {Drawable = 66, Texture = 5, Palette = 0},
            [7] = {Drawable = 0, Texture = 0, Palette = 0},
            [8] = {Drawable = 3, Texture = 0, Palette = 0},
            [9] = {Drawable = 0, Texture = 0, Palette = 0},
            [10] = {Drawable = 0, Texture = 0, Palette = 0},
            [11] = {Drawable = 38, Texture = 3, Palette = 0},
        },
        Props = {},
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
    --- BCSO
    [GetHashKey("sheriff")] = true,
    [GetHashKey("sheriff2")] = true,
    [GetHashKey("sheriff3")] = true,
    [GetHashKey("sheriff4")] = true,
    [GetHashKey("sheriffb")] = true,
    [GetHashKey("sheriffdodge")] = true,
    [GetHashKey("sheriffcara")] = true,
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

--- Armors
Config.Armors = {
    [GetHashKey("mp_m_freemode_01")] = {
        ["unmark"] = {Drawable = 27, Texture = 0, Palette = 0},
        ["lspd"] = {Drawable = 20, Texture = 0, Palette = 0},
        ["bcso"] = {Drawable = 27, Texture = 3, Palette = 0},
        ["lsmc"] = {Drawable = 27, Texture = 0, Palette = 0}, -- is unmarked, need reskin
        ["stonk"] = {Drawable = 2, Texture = 0, Palette = 0},
        ["fbi"] = {Drawable = 27, Texture = 2, Palette = 0},
        ["news"] = {Drawable = 27, Texture = 0, Palette = 0}, -- is unmarked, need reskin
    },
    [GetHashKey("mp_f_freemode_01")] = {
        ["unmark"] = {Drawable = 29, Texture = 7, Palette = 0},
        ["lspd"] = {Drawable = 23, Texture = 0, Palette = 0},
        ["bcso"] = {Drawable = 29, Texture = 3, Palette = 0},
        ["lsmc"] = {Drawable = 29, Texture = 7, Palette = 0}, -- is unmarked, need reskin
        ["stonk"] = {Drawable = 2, Texture = 0, Palette = 0},
        ["fbi"] = {Drawable = 29, Texture = 2, Palette = 0},
        ["news"] = {Drawable = 29, Texture = 7, Palette = 0}, -- is unmarked, need reskin
    },
}

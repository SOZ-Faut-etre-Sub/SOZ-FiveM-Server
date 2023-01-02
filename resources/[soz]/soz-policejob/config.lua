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
            ["Tenue Hiver"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 11, Texture = 0, Palette = 0},
                    [4] = {Drawable = 22, Texture = 8, Palette = 0},
                    [5] = {Drawable = 54, Texture = 0, Palette = 0},
                    [6] = {Drawable = 51, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 12, Texture = 7, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 413, Texture = 0, Palette = 0},
                },
                Props = {[0] = {Drawable = 33, Texture = 1, Palette = 0}},
            },
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
            ["Tenue Hiver"] = {
                Components = {
                    [1] = {Drawable = 0, Texture = 0, Palette = 0},
                    [3] = {Drawable = 9, Texture = 0, Palette = 0},
                    [4] = {Drawable = 3, Texture = 7, Palette = 0},
                    [5] = {Drawable = 54, Texture = 0, Palette = 0},
                    [6] = {Drawable = 52, Texture = 0, Palette = 0},
                    [7] = {Drawable = 8, Texture = 0, Palette = 0},
                    [8] = {Drawable = 38, Texture = 8, Palette = 0},
                    [9] = {Drawable = 0, Texture = 0, Palette = 0},
                    [10] = {Drawable = 0, Texture = 0, Palette = 0},
                    [11] = {Drawable = 440, Texture = 0, Palette = 0},
                },
                Props = {[0] = {Drawable = 32, Texture = 1, Palette = 0}},
            },
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

Config.RadarAllowedVehicle = {
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

Config.RadarInformedVehicle = {
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

-- TODO: Move the radar configuration in database for the Chains Of Justice DLC
--- Radars config
Config.Radars = {
    [1] = {
        props = vector4(-54.77, 6338.8, 30.33, 155.46),
        zone = vector3(-60.35, 6321.91, 31.3),
        station = "bcso",
        isOnline = true,
        zoneRadius = 9,
        speed = 130,
    },
    -- Freeway Radars, do not touch until migration in DB
    [2] = {
        props = vector4(2365.11, 5763.63, 44.94, 236.35),
        zone = vector3(2386.17, 5745.69, 45.73),
        station = "bcso",
        isOnline = false,
        zoneRadius = 10,
        speed = 0,
    },
    [3] = {
        props = vector4(-2831.09, 2176.07, 30.84, 320.84),
        zone = vector3(-2813.6, 2202.67, 28.91),
        station = "bcso",
        isOnline = true,
        zoneRadius = 15,
        speed = 130,
    },
    [4] = {
        props = vector4(2149.54, 3761.94, 31.89, 320.54),
        zone = vector3(2161.77, 3778.34, 33.36),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 110,
    },
    [5] = {
        props = vector4(710.03, 2707.9, 39.23, 116.24),
        zone = vector3(695.75, 2700.52, 40.5),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 110,
    },
    [6] = {
        props = vector4(2234.08, 4744.3, 38.66, 111.03),
        zone = vector3(2221.52, 4739.29, 40.14),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 110,
    },
    [7] = {
        props = vector4(1131.91, 1890.94, 64.72, 42.22),
        zone = vector3(1118.43, 1909.73, 63.44),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 110,
    },
    [8] = {
        props = vector4(-1434.12, 1930.06, 72.43, 202.18),
        zone = vector3(-1425.47, 1905.34, 74.05),
        station = "bcso",
        isOnline = true,
        zoneRadius = 10,
        speed = 110,
    },
    -- Freeway Radars, do not touch until migration in DB
    [9] = {
        props = vector4(2767.39, 4601.74, 44.2, 29.84),
        zone = vector3(2751.96, 4625.0, 44.89),
        station = "bcso",
        isOnline = false,
        zoneRadius = 10,
        speed = 0,
    },
    [10] = {
        props = vector4(-797.55, 2231.07, 86.17, 356.3),
        zone = vector3(-798.91, 2252.27, 84.23),
        station = "bcso",
        isOnline = true,
        zoneRadius = 8,
        speed = 110,
    },
    [11] = {
        props = vector4(-2467.23, -219.14, 16.65, 220.11),
        zone = vector3(-2447.98, -238.33, 16.61),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 130,
    },
    [12] = {
        props = vector4(-1919.08, 692.07, 125.73, 166.88),
        zone = vector3(-1922.6, 671.7, 125.62),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 110,
    },
    [13] = {
        props = vector4(-1650.11, -600.63, 32.63, 259.89),
        zone = vector3(-1622.3, -606.86, 32.67),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 90,
    },
    [14] = {
        props = vector4(-11.96, -441.02, 39.34, 7.71),
        zone = vector3(-17.41, -405.88, 39.68),
        station = "lspd",
        isOnline = true,
        zoneRadius = 14,
        speed = 90,
    },
    [15] = {
        props = vector4(-163.0, 109.87, 69.42, 215.3),
        zone = vector3(-148.8, 90.02, 70.77),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [16] = {
        props = vector4(736.53, -1725.36, 28.38, 221.79),
        zone = vector3(762.64, -1740.99, 29.52),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 90,
    },
    [17] = {
        props = vector4(-943.88, -1818.97, 18.8, 330.71),
        zone = vector3(-933.51, -1797.83, 19.84),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
    [18] = {
        props = vector4(-699.19, -824.05, 22.75, 225.37),
        zone = vector3(-681.3, -837.16, 24.14),
        station = "lspd",
        isOnline = true,
        zoneRadius = 12,
        speed = 90,
    },
    -- Freeway Radars, do not touch until migration in DB
    [19] = {
        props = vector4(844.38, 141.1, 71.3, 301.84),
        zone = vector3(868.5, 154.6, 73.41),
        station = "lspd",
        isOnline = false,
        zoneRadius = 12,
        speed = 0,
    },
    [20] = {
        props = vector4(-1001.81, 102.48, 51.33, 59.55),
        zone = vector3(-1014.42, 114.04, 52.91),
        station = "lspd",
        isOnline = true,
        zoneRadius = 8,
        speed = 90,
    },
}

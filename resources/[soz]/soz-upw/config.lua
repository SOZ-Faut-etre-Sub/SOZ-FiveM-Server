QBCore = exports["qb-core"]:GetCoreObject()

Config = {}

Config.Blip = {
    station = {Name = "Unexpected Power & Water", Coords = vector2(594.47, 2768.05), Sprite = 768, Scale = 1.0},
    plant = {Name = "Installation électrique", Sprite = 354, Scale = 1.2, Color = 1},
    inverter = {Name = "Onduleur", Sprite = 587, Scale = 1.0, Color = 47},
    terminal_global = {Name = "Borne civile", Sprite = 683, Scale = 1.0, Color = 4},
    terminal_job = {Name = "Borne entreprise", Sprite = 683, Scale = 1.0, Color = 5},
    resell = {Name = "Revente d'énergie", Sprite = 768, Scale = 1.0, Color = 0},
}

Config.InverterMaxCapacity = 300000

Config.Items = {
    Energy = {fossil1 = "energy_cell_fossil", hydro1 = "energy_cell_hydro", wind1 = "energy_cell_wind"},
    Waste = {Hydro = "seeweed_acid"},
}

Config.Harvest = {Duration = 10000}

Config.Production = {
    Tick = 48000, -- in ms
    EnergyPerCell = {
        energy_cell_fossil = GetConvarInt("soz_upw_energy_per_cell_fossil", 1),
        energy_cell_hydro = GetConvarInt("soz_upw_energy_per_cell_hydro", 1),
        energy_cell_wind = GetConvarInt("soz_upw_energy_per_cell_wind", 1),
    },
    WastePerHarvest = GetConvarInt("soz_upw_waste_per_harvest", 1),
    HourBoost = {fossil1 = 1, hydro1 = 1, wind1 = 1},
}

Config.Consumption = {
    Tick = 60000, -- in ms
    EnergyPerTick = GetConvarInt("soz_upw_consumption_energy_per_tick", 1) / 100, -- per connected player
    EnergyJobPerTick = GetConvarInt("soz_upw_consumption_energy_job_per_tick", 1) / 100, -- per player on duty
}

Config.FieldHealthStates = {[0] = "0000", [1] = "1000", [2] = "1100", [3] = "1110", [4] = "1111"}
Config.WasteMultiplier = {
    [0.5] = {max = 0.2},
    [0.475] = {min = 0.2, max = 0.25},
    [0.425] = {min = 0.25, max = 0.3},
    [0.35] = {min = 0.3, max = 0.35},
    [0.225] = {min = 0.35, max = 0.4},
    [0.05] = {min = 0.4, max = 0.45},
    [0.005] = {min = 0.45, max = 0.5},
    [0] = {min = 0.5},
}

Config.Pollution = {
    -- this value per hour represents 100% pollution
    MaxUnitsPerHour = 900,
    Persistence = 24 * 7, -- 24, -- previous pollution units kept this amount of hours
    Tick = 60000, -- in ms
}

Config.Pollution.Threshold = {
    [QBCore.Shared.Pollution.Level.Low] = {min = 0, max = 11},
    [QBCore.Shared.Pollution.Level.Neutral] = {min = 11, max = 70},
    [QBCore.Shared.Pollution.Level.High] = {min = 70, max = 100},
}

Config.Pollution.Multiplier = {
    [QBCore.Shared.Pollution.Level.Low] = 1.0,
    [QBCore.Shared.Pollution.Level.Neutral] = 1.0,
    [QBCore.Shared.Pollution.Level.High] = 1.0,
}

Config.Blackout = {}
Config.Blackout.Threshold = {
    [QBCore.Shared.Blackout.Level.Four] = {min = 0, max = 5},
    [QBCore.Shared.Blackout.Level.Three] = {min = 5, max = 20},
    [QBCore.Shared.Blackout.Level.Two] = {min = 20, max = 35},
    [QBCore.Shared.Blackout.Level.One] = {min = 35, max = 50},
    [QBCore.Shared.Blackout.Level.Zero] = {min = 50, max = 100},
}

Config.Upw = {}
Config.Upw.Accounts = {FarmAccount = "farm_upw", SafeAccount = "safe_upw"}
Config.Upw.Resale = {
    Duration = 5000,
    EnergyCellPrice = {["energy_cell_fossil"] = 20, ["energy_cell_hydro"] = 45, ["energy_cell_wind"] = 100},
    EnergyCellPriceGlobal = {["energy_cell_fossil"] = 30, ["energy_cell_hydro"] = 18, ["energy_cell_wind"] = 12},
    Zone = {coords = vector3(291.97, -2885.82, 6.01), sx = 5.2, sy = 3.8, heading = 0, minZ = 5.01, maxZ = 8.21},
}

Config.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        {
            name = "Tenue d'apprenti pour été",
            skin = {
                Components = {
                    [3] = {Palette = 0, Drawable = 41, Texture = 0},
                    [4] = {Palette = 0, Drawable = 98, Texture = 19},
                    [6] = {Palette = 0, Drawable = 12, Texture = 5},
                    [7] = {Palette = 0, Drawable = 0, Texture = 0},
                    [8] = {Palette = 0, Drawable = 15, Texture = 0},
                    [9] = {Palette = 0, Drawable = 0, Texture = 0},
                    [10] = {Palette = 0, Drawable = 0, Texture = 0},
                    [11] = {Palette = 0, Drawable = 146, Texture = 6},
                },
                Props = {[0] = {Drawable = 145, Texture = 0, Palette = 0}},
            },
        },
        {
            name = "Tenue d'apprenti pour hiver",
            skin = {
                Components = {
                    [3] = {Palette = 0, Drawable = 42, Texture = 0},
                    [4] = {Palette = 0, Drawable = 98, Texture = 19},
                    [6] = {Palette = 0, Drawable = 12, Texture = 5},
                    [7] = {Palette = 0, Drawable = 0, Texture = 0},
                    [8] = {Palette = 0, Drawable = 2, Texture = 2},
                    [9] = {Palette = 0, Drawable = 0, Texture = 0},
                    [10] = {Palette = 0, Drawable = 0, Texture = 0},
                    [11] = {Palette = 0, Drawable = 244, Texture = 4},
                },
                Props = {[0] = {Drawable = 145, Texture = 0, Palette = 0}},
            },
        },
        {
            name = "Tenue d'électricien pour été",
            skin = {
                Components = {
                    [3] = {Palette = 0, Drawable = 41, Texture = 0},
                    [4] = {Palette = 0, Drawable = 98, Texture = 19},
                    [6] = {Palette = 0, Drawable = 12, Texture = 5},
                    [7] = {Palette = 0, Drawable = 0, Texture = 0},
                    [8] = {Palette = 0, Drawable = 15, Texture = 0},
                    [9] = {Palette = 0, Drawable = 0, Texture = 0},
                    [10] = {Palette = 0, Drawable = 0, Texture = 0},
                    [11] = {Palette = 0, Drawable = 22, Texture = 1},
                },
                Props = {[0] = {Drawable = 145, Texture = 1, Palette = 0}},
            },
        },
        {
            name = "Tenue d'électricien pour hiver",
            skin = {
                Components = {
                    [3] = {Palette = 0, Drawable = 42, Texture = 0},
                    [4] = {Palette = 0, Drawable = 98, Texture = 19},
                    [6] = {Palette = 0, Drawable = 12, Texture = 5},
                    [7] = {Palette = 0, Drawable = 0, Texture = 0},
                    [8] = {Palette = 0, Drawable = 2, Texture = 2},
                    [9] = {Palette = 0, Drawable = 0, Texture = 0},
                    [10] = {Palette = 0, Drawable = 0, Texture = 0},
                    [11] = {Palette = 0, Drawable = 244, Texture = 6},
                },
                Props = {[0] = {Drawable = 145, Texture = 1, Palette = 0}},
            },
        },
        {
            name = "Tenue de chef électricien pour été",
            skin = {
                Components = {
                    [3] = {Palette = 0, Drawable = 41, Texture = 0},
                    [4] = {Palette = 0, Drawable = 98, Texture = 19},
                    [6] = {Palette = 0, Drawable = 12, Texture = 5},
                    [7] = {Palette = 0, Drawable = 0, Texture = 0},
                    [8] = {Palette = 0, Drawable = 15, Texture = 0},
                    [9] = {Palette = 0, Drawable = 0, Texture = 0},
                    [10] = {Palette = 0, Drawable = 0, Texture = 0},
                    [11] = {Palette = 0, Drawable = 241, Texture = 2},
                },
                Props = {[0] = {Drawable = 145, Texture = 2, Palette = 0}},
            },
        },
        {
            name = "Tenue de chef électricien pour hiver",
            skin = {
                Components = {
                    [3] = {Palette = 0, Drawable = 42, Texture = 0},
                    [4] = {Palette = 0, Drawable = 98, Texture = 19},
                    [6] = {Palette = 0, Drawable = 12, Texture = 5},
                    [7] = {Palette = 0, Drawable = 0, Texture = 0},
                    [8] = {Palette = 0, Drawable = 2, Texture = 2},
                    [9] = {Palette = 0, Drawable = 0, Texture = 0},
                    [10] = {Palette = 0, Drawable = 0, Texture = 0},
                    [11] = {Palette = 0, Drawable = 244, Texture = 7},
                },
                Props = {[0] = {Drawable = 145, Texture = 2, Palette = 0}},
            },
        },
        {
            name = "Tenue de la Direction",
            skin = {
                Components = {
                    [3] = {Palette = 0, Drawable = 1, Texture = 0},
                    [4] = {Palette = 0, Drawable = 25, Texture = 0},
                    [6] = {Palette = 0, Drawable = 56, Texture = 1},
                    [7] = {Palette = 0, Drawable = 0, Texture = 0},
                    [8] = {Palette = 0, Drawable = 32, Texture = 0},
                    [9] = {Palette = 0, Drawable = 0, Texture = 0},
                    [10] = {Palette = 0, Drawable = 0, Texture = 0},
                    [11] = {Palette = 0, Drawable = 294, Texture = 7},
                },
                Props = {[0] = {Drawable = 145, Texture = 3, Palette = 0}},
            },
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        {
            name = "Tenue d'apprentie pour été",
            skin = {
                Components = {
                    [3] = {Texture = 0, Palette = 0, Drawable = 57},
                    [4] = {Texture = 19, Palette = 0, Drawable = 101},
                    [6] = {Texture = 2, Palette = 0, Drawable = 60},
                    [7] = {Texture = 0, Palette = 0, Drawable = 0},
                    [8] = {Texture = 9, Palette = 0, Drawable = 101},
                    [9] = {Texture = 0, Palette = 0, Drawable = 0},
                    [10] = {Texture = 0, Palette = 0, Drawable = 0},
                    [11] = {Texture = 1, Palette = 0, Drawable = 141},
                },
                Props = {[0] = {Drawable = 144, Texture = 0, Palette = 0}},
            },
        },
        {
            name = "Tenue d'apprentie pour hiver",
            skin = {
                Components = {
                    [3] = {Texture = 0, Palette = 0, Drawable = 46},
                    [4] = {Texture = 19, Palette = 0, Drawable = 101},
                    [6] = {Texture = 2, Palette = 0, Drawable = 60},
                    [7] = {Texture = 0, Palette = 0, Drawable = 0},
                    [8] = {Texture = 5, Palette = 0, Drawable = 213},
                    [9] = {Texture = 0, Palette = 0, Drawable = 0},
                    [10] = {Texture = 0, Palette = 0, Drawable = 0},
                    [11] = {Texture = 4, Palette = 0, Drawable = 252},
                },
                Props = {[0] = {Drawable = 144, Texture = 0, Palette = 0}},
            },
        },
        {
            name = "Tenue d'électricienne pour été",
            skin = {
                Components = {
                    [3] = {Texture = 0, Palette = 0, Drawable = 57},
                    [4] = {Texture = 19, Palette = 0, Drawable = 101},
                    [6] = {Texture = 2, Palette = 0, Drawable = 60},
                    [7] = {Texture = 0, Palette = 0, Drawable = 0},
                    [8] = {Texture = 9, Palette = 0, Drawable = 101},
                    [9] = {Texture = 0, Palette = 0, Drawable = 0},
                    [10] = {Texture = 0, Palette = 0, Drawable = 0},
                    [11] = {Texture = 1, Palette = 0, Drawable = 286},
                },
                Props = {[0] = {Drawable = 144, Texture = 1, Palette = 0}},
            },
        },
        {
            name = "Tenue d'électricienne pour hiver",
            skin = {
                Components = {
                    [3] = {Texture = 0, Palette = 0, Drawable = 46},
                    [4] = {Texture = 19, Palette = 0, Drawable = 101},
                    [6] = {Texture = 2, Palette = 0, Drawable = 60},
                    [7] = {Texture = 0, Palette = 0, Drawable = 0},
                    [8] = {Texture = 5, Palette = 0, Drawable = 213},
                    [9] = {Texture = 0, Palette = 0, Drawable = 0},
                    [10] = {Texture = 0, Palette = 0, Drawable = 0},
                    [11] = {Texture = 6, Palette = 0, Drawable = 252},
                },
                Props = {[0] = {Drawable = 144, Texture = 1, Palette = 0}},
            },
        },
        {
            name = "Tenue de cheffe électricienne pour été",
            skin = {
                Components = {
                    [3] = {Texture = 0, Palette = 0, Drawable = 57},
                    [4] = {Texture = 19, Palette = 0, Drawable = 101},
                    [6] = {Texture = 2, Palette = 0, Drawable = 60},
                    [7] = {Texture = 0, Palette = 0, Drawable = 0},
                    [8] = {Texture = 9, Palette = 0, Drawable = 101},
                    [9] = {Texture = 0, Palette = 0, Drawable = 0},
                    [10] = {Texture = 0, Palette = 0, Drawable = 0},
                    [11] = {Texture = 2, Palette = 0, Drawable = 249},
                },
                Props = {[0] = {Drawable = 144, Texture = 2, Palette = 0}},
            },
        },
        {
            name = "Tenue de cheffe électricienne pour hiver",
            skin = {
                Components = {
                    [3] = {Texture = 0, Palette = 0, Drawable = 46},
                    [4] = {Texture = 19, Palette = 0, Drawable = 101},
                    [6] = {Texture = 2, Palette = 0, Drawable = 60},
                    [7] = {Texture = 0, Palette = 0, Drawable = 0},
                    [8] = {Texture = 5, Palette = 0, Drawable = 213},
                    [9] = {Texture = 0, Palette = 0, Drawable = 0},
                    [10] = {Texture = 0, Palette = 0, Drawable = 0},
                    [11] = {Texture = 7, Palette = 0, Drawable = 252},
                },
                Props = {[0] = {Drawable = 144, Texture = 2, Palette = 0}},
            },
        },
        {
            name = "Tenue de la Direction",
            skin = {
                Components = {
                    [3] = {Texture = 0, Palette = 0, Drawable = 5},
                    [4] = {Texture = 0, Palette = 0, Drawable = 133},
                    [6] = {Texture = 0, Palette = 0, Drawable = 27},
                    [7] = {Texture = 0, Palette = 0, Drawable = 0},
                    [8] = {Texture = 6, Palette = 0, Drawable = 217},
                    [9] = {Texture = 0, Palette = 0, Drawable = 0},
                    [10] = {Texture = 0, Palette = 0, Drawable = 0},
                    [11] = {Texture = 2, Palette = 0, Drawable = 6},
                },
                Props = {[0] = {Drawable = 144, Texture = 3, Palette = 0}},
            },
        },
    },
}

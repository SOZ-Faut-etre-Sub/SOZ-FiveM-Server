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
    [1] = {max = 0.2},
    [0.95] = {min = 0.2, max = 0.25},
    [0.85] = {min = 0.25, max = 0.3},
    [0.7] = {min = 0.3, max = 0.35},
    [0.45] = {min = 0.35, max = 0.4},
    [0.1] = {min = 0.4, max = 0.45},
    [0.01] = {min = 0.45, max = 0.5},
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

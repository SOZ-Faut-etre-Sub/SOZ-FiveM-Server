Config = {}

Config = {
    DisableControl = {
        [0] = true, -- compacts
        [1] = true, -- sedans
        [2] = true, -- SUV's
        [3] = true, -- coupes
        [4] = true, -- muscle
        [5] = true, -- sport classic
        [6] = true, -- sport
        [7] = true, -- super
        [8] = false, -- motorcycle
        [9] = true, -- offroad
        [10] = true, -- industrial
        [11] = true, -- utility
        [12] = true, -- vans
        [13] = false, -- bicycles
        [14] = false, -- boats
        [15] = false, -- helicopter
        [16] = false, -- plane
        [17] = true, -- service
        [18] = true, -- emergency
        [19] = false, -- military
    },
}

Config.JerryCanRefill = 30.0

Config.PumpModels = {
    [-2007231801] = true,
    [1339433404] = true,
    [1694452750] = true,
    [1933174915] = true,
    [-462817101] = true,
    [-469694731] = true,
    [-164877493] = true,
}

Config.oilDivider = 280.0

Config.MaxOil = {
    [0] = 6.5, -- Compacts
    [1] = 6.5, -- Sedans
    [2] = 6.5, -- SUVs
    [3] = 6.5, -- Coupes
    [4] = 6.5, -- Muscle
    [5] = 6.5, -- Sports Classics
    [6] = 6.5, -- Sports
    [7] = 6.5, -- Super
    [8] = 5.0, -- Motorcycles
    [9] = 6.5, -- Off-road
    [10] = 8.0, -- Industrial
    [11] = 8.0, -- Utility
    [12] = 6.5, -- Vans
    [13] = 0.0, -- Cycles
    [14] = 3.0, -- Boats
    [15] = 8.0, -- Helicopters
    [16] = 5.0, -- Planes
    [17] = 6.5, -- Service
    [18] = 6.5, -- Emergency
    [19] = 6.5, -- Military
    [20] = 6.5, -- Commercial
    [21] = 0.0, -- Trains
    [22] = 6.5, -- Ultra lightweight
}


HouseGarages = {}

Config.FuelStations = {
    Blip = {Name = "Station essence", Sprite = 361, Color = 4, Alpha = 100},
    Vehicle = {
        ElectricModel = {
            [GetHashKey("airtag")] = true,
            [GetHashKey("caddy")] = true,
            [GetHashKey("caddy2")] = true,
            [GetHashKey("caddy3")] = true,
            [GetHashKey("cyclone")] = true,
            [GetHashKey("cyclone2")] = true,
            [GetHashKey("iwagen")] = true,
            -- [GetHashKey("dilettante")] = true,
            -- [GetHashKey("dilettante2")] = true,
            [GetHashKey("khamelion")] = true,
            [GetHashKey("neon")] = true,
            [GetHashKey("omnisegt")] = true,
            [GetHashKey("rcbandito")] = true,
            [GetHashKey("raiden")] = true,
            [GetHashKey("surge")] = true,
            [GetHashKey("tezeract")] = true,
            [GetHashKey("voltic")] = true,
        },
    },
}

-- All chances are 0-1 <= so lower == less chance, higher == higher chance
Config.RemoveLockpickNormal = 0.5 -- Chance to remove lockpick on fail
Config.RemoveLockpickAdvanced = 0.2 -- Chance to remove advanced lockpick on fail
Config.AlertCooldown = 10000 -- 10 seconds
Config.PoliceAlertChance = 0.5 -- Chance of alerting police during the day
Config.PoliceNightAlertChance = 0.25 -- Chance of alerting police at night (times:01-06)

-- LS CUSTOM
Config.AttachedCustomVehicle = nil

Config.maxVehiclePerformanceUpgrades = 0 -- 0 pour pas de limite d'upgrade

Config.ValuesLabels = {
    ["engine"] = "Moteur",
    ["body"] = "Carrosserie",
    ["radiator"] = "Radiateur",
    ["axle"] = "Transmission",
    ["brakes"] = "Freins",
    ["clutch"] = "Embrayage",
    ["fuel"] = "Réservoir",
}

Config.Blacklist = { -- Integers | Blacklist classes from being towed.
    16, -- Planes
    21, -- Trains
}

Config.Flatbeds = {
    {
        Hash = "flatbed3", -- String | Hash Of The Vehicle
        Extras = {
            [1] = false, -- Integer | Enable/Disable Extra's When Used
        },
        Marker = vector3(-1.85, 0.4, -1.2), -- X, Y, Z | Marker Location
        Attach = vector2(0.0, 1.0), -- X, Y | Attach/Weld Location
        Radius = 3.0, -- Integer | ClosestVehicle Radius
        Default = {
            Pos = vector3(0.0, -3.8, 0.35), -- X, Y(Runs Second), Z(Runs First) | Default Offset Position
            Rot = vector3(0.0, 0.0, 0.0), -- X, Y, Z | Default Rotation
        },
        Active = {
            Pos = vector3(0.0, -8.20, -0.75), -- X, Y(Runs First), Z(Runs Second) | Lowered Offset Position
            Rot = vector3(16.0, 0.0, 0.0), -- X, Y, Z | Lowered Rotation
        },
    },
}

Config.BedProp = "inm_flatbed_base" -- String | Hash Of The Bed Prop

VehicleState = {Out = 0, InGarage = 1, InPound = 2, InEntreprise = 3, Missing = 4, Destroyed = 5}

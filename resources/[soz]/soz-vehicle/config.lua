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

Config.Shops = {
    ["pdm"] = {
        ["ShopLabel"] = "Concess Véhicules", -- Blip name
        ["showBlip"] = true,
        ["Categories"] = {
            ["Sedans"] = "Sedans",
            ["Coupes"] = "Coupes",
            ["Suvs"] = "SUVs",
            ["Off-road"] = "Off-road",
            ["Muscle"] = "Muscle",
            ["Compacts"] = "Compacts",
            ["Vans"] = "Vans",
        },
        ["Location"] = vector3(-45.67, -1098.34, 26.42), -- Blip Location
        ["VehicleSpawn"] = vector4(-46.36, -1078.07, 26.43, 70.0), -- Spawn location when vehicle is bought
    },
    ["velo"] = {
        ["ShopLabel"] = "Concess Vélos", -- Blip name
        ["showBlip"] = true,
        ["Categories"] = {["Cycles"] = "Bicycles"},
        ["Location"] = vector3(-1222.26, -1494.83, 4.34), -- Blip Location
        ["VehicleSpawn"] = vector4(-1221.96, -1498.45, 4.35, 210.0), -- Spawn location when vehicle is bought
    },
    ["moto"] = {
        ["ShopLabel"] = "Concess Motos", -- Blip name
        ["showBlip"] = true,
        ["Categories"] = {["Motorcycles"] = "Motorcycles"},
        ["Location"] = vector3(1224.79, 2727.25, 38.0), -- Blip Location
        ["VehicleSpawn"] = vector4(1212.69, 2726.24, 38.0, 180.0), -- Spawn location when vehicle is bought
    },
}

Config.RefillCost = 50

-- Fuel decor - No need to change this, just leave it.
Config.FuelDecor = "_FUEL_LEVEL"

Config.PumpModels = {
    [-2007231801] = true,
    [1339433404] = true,
    [1694452750] = true,
    [1933174915] = true,
    [-462817101] = true,
    [-469694731] = true,
    [-164877493] = true,
}
-- Modify the fuel-cost here, using a multiplier value. Setting the value to 2.0 would cause a doubled increase.
Config.CostMultiplier = 1.0

-- Class multipliers. If you want SUVs to use less fuel, you can change it to anything under 1.0, and vise versa.
Config.Classes = {
    [0] = 0.6, -- Compacts
    [1] = 0.6, -- Sedans
    [2] = 0.6, -- SUVs
    [3] = 0.6, -- Coupes
    [4] = 0.6, -- Muscle
    [5] = 0.6, -- Sports Classics
    [6] = 0.6, -- Sports
    [7] = 0.6, -- Super
    [8] = 0.6, -- Motorcycles
    [9] = 0.6, -- Off-road
    [10] = 0.6, -- Industrial
    [11] = 0.6, -- Utility
    [12] = 0.6, -- Vans
    [13] = 0.0, -- Cycles
    [14] = 0.6, -- Boats
    [15] = 0.0, -- Helicopters
    [16] = 0.6, -- Planes
    [17] = 0.6, -- Service
    [18] = 0.6, -- Emergency
    [19] = 0.6, -- Military
    [20] = 0.6, -- Commercial
    [21] = 0.6, -- Trains
}

-- The left part is at percentage RPM, and the right is how much fuel (divided by 10) you want to remove from the tank every second
Config.FuelUsage = {
    [1.0] = 1.4,
    [0.9] = 1.2,
    [0.8] = 1.0,
    [0.7] = 0.9,
    [0.6] = 0.8,
    [0.5] = 0.7,
    [0.4] = 0.5,
    [0.3] = 0.4,
    [0.2] = 0.2,
    [0.1] = 0.1,
    [0.0] = 0.0,
}

Garages = {
    ["motelgarage"] = {
        label = "Motel Parking",
        blipcoord = vector3(273.43, -343.99, 44.91),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["spanishave"] = {
        label = "Spanish Ave Parking",
        blipcoord = vector3(-1178.29, -726.49, 20.73),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["greatoceanp"] = {
        label = "Great Ocean Parking",
        blipcoord = vector3(1455.84, 6546.71, 14.89),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["sandyshores"] = {
        label = "Sandy Shores Parking",
        blipcoord = vector3(1503.52, 3763.37, 33.99),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["airportprivate"] = {
        label = "Airport Private Parking",
        blipcoord = vector3(-987.87, -2698.61, 13.83),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["chumashp"] = {
        label = "Chumash Parking",
        blipcoord = vector3(-3135.51, 1105.58, 20.64),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["stadiump"] = {
        label = "Stadium Parking",
        blipcoord = vector3(-75.89, -2004.11, 18.03),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car",
    },
    ["diamondp"] = {
        label = "Diamond Parking",
        blipcoord = vector3(890.21, -3.77, 78.76),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["lagunapi"] = {
        label = "Laguna Parking",
        blipcoord = vector3(364.37, 297.83, 103.49),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["beachp"] = {
        label = "Beach Parking",
        blipcoord = vector3(-1183.1, -1511.11, 4.36),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["themotorhotel"] = {
        label = "The Motor Hotel Parking",
        blipcoord = vector3(1137.77, 2663.54, 37.9),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["marinadrive"] = {
        label = "Marina Drive Parking",
        blipcoord = vector3(952.2, 3608.47, 32.83),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["shambles"] = {
        label = "Shambles Parking",
        blipcoord = vector3(1002.58, -2362.77, 30.51),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["pillboxgarage"] = {
        label = "Pillbox Garage Parking",
        blipcoord = vector3(215.9499, -809.698, 30.731),
        showBlip = true,
        blipName = "Parking Privé",
        blipNumber = 357,
        type = "private", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["airportpublic"] = {
        label = "Airport Public Parking",
        blipcoord = vector3(-614.01, -2234.77, 6.0),
        showBlip = true,
        blipName = "Parking Public",
        blipNumber = 357,
        type = "public", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["haanparking"] = {
        label = "Bell Farms Parking",
        blipcoord = vector3(90.4, 6388.08, 31.23),
        showBlip = true,
        blipName = "Parking Public",
        blipNumber = 357,
        type = "public", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["fourriere"] = {
        label = "Fourrière",
        blipcoord = vector3(491.0, -1314.69, 29.25),
        showBlip = true,
        blipName = "Fourrière",
        blipNumber = 68,
        type = "depot", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
    },
    ["lspd"] = {
        label = "LSPD",
        blipcoord = vector4(598.88, 5.57, 69.61, 341.51),
        showBlip = false,
        blipName = "LSPD",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "lspd",
    },
    ["lsmc"] = {
        label = "LSMC",
        blipcoord = vector4(412.22, -1416.05, 28.38, 323.72),
        showBlip = false,
        blipName = "LSMC",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "lsmc",
    },
    ["bcso"] = {
        label = "BCSO",
        blipcoord = vector4(1854.63, 3679.58, 32.83, 29.91),
        showBlip = false,
        blipName = "BCSO",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "bcso",
    },
    ["bennys"] = {
        label = "Bennys",
        blipcoord = vector4(-172.5, -1295.65, 30.13, 0.0),
        showBlip = false,
        blipName = "Bennys",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "bennys",
    },
    ["stonk"] = {
        label = "STONK Depository",
        blipcoord = vector4(-6.51, -662.66, 32.48, 185.00),
        showBlip = false,
        blipName = "STONK Depository",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "cash-transfer",
    },
    ["garbage"] = {
        label = "Blue Bird",
        blipcoord = vector4(-589.74, -1568.28, 25.75, 318.84),
        showBlip = false,
        blipName = "Blue Bird",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "garbage",
    },
    ["food"] = {
        label = "Château Marius",
        blipcoord = vector4(-1923.05, 2060.66, 139.83, 77.0),
        showBlip = false,
        blipName = "Château Marius",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "food",
    },
    ["news"] = {
        label = "Twitch News",
        blipcoord = vector4(-539.4, -877.38, 24.24, 353.76),
        showBlip = false,
        blipName = "Twitch News",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "news",
    },
    ["mtp"] = {
        label = "Michel Transport Petrol",
        blipcoord = vector4(-276.89, 6017.69, 31.02, 226.23),
        showBlip = false,
        blipName = "Michel Transport Petrol",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "oil",
    },
    ["taxi"] = {
        label = "Carl Jr Service",
        blipcoord = vector4(904.43, -168.09, 73.09, 61.18),
        showBlip = false,
        blipName = "Carl Jr Service",
        blipNumber = 357,
        type = "entreprise", -- public, job, gang, depot
        vehicle = "car", -- car, air, sea
        job = "taxi",
    },
    --[[
    ["intairport"] = {
        label = "Airport Heliport",
        blipcoord = vector3(-928.84, -2994.38, 19.85),
        showBlip = false,
        blipName = "Héliport",
        blipNumber = 360,
        type = "public", -- public, job, gang, depot
        vehicle = "air", -- car, air, sea
    },
    ["higginsheli"] = {
        label = "Higgins Helitours",
        blipcoord = vector3(-753.27, -1511.5, 5.01),
        showBlip = false,
        blipName = "Héliport",
        blipNumber = 360,
        type = "public", -- public, job, gang, depot
        vehicle = "air", -- car, air, sea
    },
    ["airsshores"] = {
        label = "Sandy Shores",
        blipcoord = vector3(1758.19, 3296.66, 41.14),
        showBlip = false,
        blipName = "Héliport",
        blipNumber = 360,
        type = "public", -- public, job, gang, depot
        vehicle = "air", -- car, air, sea
    },
    ["airdepot"] = {
        label = "Dépot Aéronef",
        blipcoord = vector3(-1243.29, -3392.3, 13.94),
        showBlip = false,
        blipName = "Dépot Aéronef",
        blipNumber = 359,
        type = "depot", -- public, job, gang, depot
        vehicle = "air", -- car, air, sea
    },
    ["lsymc"] = {
        label = "Port LSYMC",
        blipcoord = vector3(-794.66, -1510.83, 1.59),
        showBlip = false,
        blipName = "Marina",
        blipNumber = 356,
        type = "public", -- public, job, gang, depot
        vehicle = "sea", -- car, air, sea
    },
    ["paleto"] = {
        label = "Port Paleto",
        blipcoord = vector3(-277.46, 6637.2, 7.48),
        showBlip = false,
        blipName = "Marina",
        blipNumber = 356,
        type = "public", -- public, job, gang, depot
        vehicle = "sea", -- car, air, sea
    },
    ["millars"] = {
        label = "Port Millars",
        blipcoord = vector3(1299.24, 4216.69, 33.9),
        showBlip = false,
        blipName = "Marina",
        blipNumber = 356,
        type = "public", -- public, job, gang, depot
        vehicle = "sea", -- car, air, sea
    },
    ["catfish"] = {
        label = "Port Catfish",
        blipcoord = vector3(3865.66, 4463.73, 2.72),
        showBlip = false,
        blipName = "Marina",
        blipNumber = 356,
        type = "public", -- public, job, gang, depot
        vehicle = "sea", -- car, air, sea
    },
    ["seadepot"] = {
        label = "Dépot LSYMC",
        blipcoord = vector3(-772.98, -1430.76, 1.59),
        showBlip = false,
        blipName = "Dépot LSYMC",
        blipNumber = 356,
        type = "depot", -- public, job, gang, depot
        vehicle = "sea", -- car, air, sea
    },
    --]]
}

HouseGarages = {}

-- All chances are 0-1 <= so lower == less chance, higher == higher chance
Config.RemoveLockpickNormal = 0.5 -- Chance to remove lockpick on fail
Config.RemoveLockpickAdvanced = 0.2 -- Chance to remove advanced lockpick on fail
Config.AlertCooldown = 10000 -- 10 seconds
Config.PoliceAlertChance = 0.5 -- Chance of alerting police during the day
Config.PoliceNightAlertChance = 0.25 -- Chance of alerting police at night (times:01-06)

-- LS CUSTOM
Config.AttachedCustomVehicle = nil

Config.maxVehiclePerformanceUpgrades = 0 -- 0 pour pas de limite d'upgrade

Config.lscustom = {
    [1] = {coords = vector3(-337.38, -136.92, 38.01), blip = true},
    [2] = {coords = vector3(-1155.53, -2007.18, 12.175), blip = true},
    [3] = {coords = vector3(731.81, -1088.82, 21.169), blip = true},
    [4] = {coords = vector3(1175.04, 2640.21, 36.749), blip = true},
    [5] = {coords = vector3(110.99, 6626.39, 30.792), blip = true},
}

Config.ValuesLabels = {
    ["engine"] = "Moteur",
    ["body"] = "Carrosserie",
    ["radiator"] = "Radiateur",
    ["axle"] = "Transmission",
    ["brakes"] = "Freins",
    ["clutch"] = "Embrayage",
    ["fuel"] = "Réservoir",
}

Config.vehicleCustomisationCustom = {
    {category = "Amélioration Moteur", id = 11},
    {category = "Amélioration Freins", id = 12},
    {category = "Amélioration Transmission", id = 13},
    {category = "Amélioration Suspension", id = 15},
    {category = "Amélioration Blindage", id = 16},
    {category = "Amélioration Turbo", id = 18},
}

Config.vehicleCustomisationPricesCustom = {
    {id = 11, prices = {0, 0.1, 0.15, 0.2, 0.25, 0.3}},
    {id = 12, prices = {0, 0.08, 0.1, 0.12, 0.14, 0.16}},
    {id = 13, prices = {0, 0.08, 0.11, 0.14, 0.17, 0.2}},
    {id = 15, prices = {0, 0.06, 0.09, 0.12, 0.15, 0.18}},
    {id = 16, prices = {0, 0.25, 0.35, 0.45, 0.55, 0.65}},
    {id = 18, prices = {0.2}},
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

Config.CarWash = { -- carwash
    [1] = {["label"] = "Lavage Auto", ["coords"] = vector3(25.29, -1391.96, 29.33)},
    [2] = {["label"] = "Lavage Auto", ["coords"] = vector3(174.18, -1736.66, 29.35)},
    [3] = {["label"] = "Lavage Auto", ["coords"] = vector3(-74.56, 6427.87, 31.44)},
    [5] = {["label"] = "Lavage Auto", ["coords"] = vector3(1363.22, 3592.7, 34.92)},
    [6] = {["label"] = "Lavage Auto", ["coords"] = vector3(-699.62, -932.7, 19.01)},
}

VehicleState = {Out = 0, InGarage = 1, InPound = 2, InEntreprise = 3, Missing = 4, Destroyed = 5}

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
    }
}

Config.Shops = {
    ["pdm"] = {
        ["Zone"] = {
            ["Shape"] = { -- polygon that surrounds the shop
            vector2(-56.727394104004, -1086.2325439453), vector2(-60.612808227539, -1096.7795410156),
            vector2(-58.26834487915, -1100.572265625), vector2(-35.927803039551, -1109.0034179688),
            vector2(-34.427627563477, -1108.5111083984), vector2(-32.02657699585, -1101.5877685547),
            vector2(-33.342102050781, -1101.0377197266), vector2(-31.292987823486, -1095.3717041016)},
            ["minZ"] = 25.0, -- min height of the shop zone
            ["maxZ"] = 28.0, -- max height of the shop zone
        },
        ["ShopLabel"] = "Concessionnaire", -- Blip name
        ["showBlip"] = true,
        ["Categories"] = {
            ["Sportsclassics"] = "Sports Classics",
            ["Sedans"] = "Sedans",
            ["Coupes"] = "Coupes",
            ["Suvs"] = "SUVs",
            ["Off-road"] = "Off-road",
            ["Muscle"] = "Muscle",
            ["Compacts"] = "Compacts",
            ["Motorcycles"] = "Motorcycles",
            ["Vans"] = "Vans",
            ["Cycles"] = "Bicycles",
        },
        ["Location"] = vector3(-45.67, -1098.34, 26.42), -- Blip Location
        ["VehicleSpawn"] = vector4(-46.36, -1078.07, 26.43, 0), -- Spawn location when vehicle is bought
    }
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
    [0] = 1.0, -- Compacts
    [1] = 1.0, -- Sedans
    [2] = 1.0, -- SUVs
    [3] = 1.0, -- Coupes
    [4] = 1.0, -- Muscle
    [5] = 1.0, -- Sports Classics
    [6] = 1.0, -- Sports
    [7] = 1.0, -- Super
    [8] = 1.0, -- Motorcycles
    [9] = 1.0, -- Off-road
    [10] = 1.0, -- Industrial
    [11] = 1.0, -- Utility
    [12] = 1.0, -- Vans
    [13] = 0.0, -- Cycles
    [14] = 1.0, -- Boats
    [15] = 1.0, -- Helicopters
    [16] = 1.0, -- Planes
    [17] = 1.0, -- Service
    [18] = 1.0, -- Emergency
    [19] = 1.0, -- Military
    [20] = 1.0, -- Commercial
    [21] = 1.0, -- Trains
}

Config.GasStations = {
    vector3(49.4187, 2778.793, 58.043),
    vector3(263.894, 2606.463, 44.983),
    vector3(1039.958, 2671.134, 39.550),
    vector3(1207.260, 2660.175, 37.899),
    vector3(2539.685, 2594.192, 37.944),
    vector3(2679.858, 3263.946, 55.240),

    vector3(2005.055, 3773.887, 32.403),
    vector3(1687.156, 4929.392, 42.078),
    vector3(1701.314, 6416.028, 32.763),
    vector3(179.857, 6602.839, 31.868),
    vector3(-94.4619, 6419.594, 31.489),
    vector3(-2554.996, 2334.40, 33.078),

    vector3(-1800.375, 803.661, 138.651),
    vector3(-1437.622, -276.747, 46.207),
    vector3(-2096.243, -320.286, 13.168),
    vector3(-724.619, -935.1631, 19.213),
    vector3(-526.019, -1211.003, 18.184),
    vector3(-70.2148, -1761.792, 29.534),

    vector3(265.648, -1261.309, 29.292),
    vector3(819.653, -1028.846, 26.403),
    vector3(1208.951, -1402.567, 35.224),
    vector3(1181.381, -330.847, 69.316),
    vector3(620.843, 269.100, 103.089),
    vector3(2581.321, 362.039, 108.468),

    vector3(176.631, -1562.025, 29.263),
    vector3(-319.292, -1471.715, 30.549),
    vector3(-66.48, -2532.57, 6.14),
    vector3(1784.324, 3330.55, 41.253),
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

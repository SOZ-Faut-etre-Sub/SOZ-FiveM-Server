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
        ["Zone"] = {
            ["Shape"] = { -- polygon that surrounds the shop
                vector2(-56.727394104004, -1086.2325439453),
                vector2(-60.612808227539, -1096.7795410156),
                vector2(-58.26834487915, -1100.572265625),
                vector2(-35.927803039551, -1109.0034179688),
                vector2(-34.427627563477, -1108.5111083984),
                vector2(-32.02657699585, -1101.5877685547),
                vector2(-33.342102050781, -1101.0377197266),
                vector2(-31.292987823486, -1095.3717041016),
            },
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
    },
}

QBShared          = QBShared or {}

QBShared.Trunks = {
    --- Default GTA Vehicle Class
    [0] = { slot = 10, weight = 20000 }, -- Compacts
    [1] = { slot = 10, weight = 60000 }, -- Sedans
    [2] = { slot = 10, weight = 80000 }, -- SUVs
    [3] = { slot = 10, weight = 40000 }, -- Coupes
    [4] = { slot = 10, weight = 30000 }, -- Muscle
    [5] = { slot = 10, weight = 0 }, -- Sports Classics
    [6] = { slot = 10, weight = 0 }, -- Sports
    [7] = { slot = 10, weight = 0 }, -- Super
    [8] = { slot = 10, weight = 10000 }, -- Motorcycles
    [9] = { slot = 10, weight = 100000 }, -- Off-road
    [10] = { slot = 10, weight = 0 }, -- Industrial
    [11] = { slot = 10, weight = 0 }, -- Utility
    [12] = { slot = 10, weight = 200000 }, -- Vans
    [13] = { slot = 10, weight = 2000 }, -- Cycles
    [14] = { slot = 10, weight = 0 }, -- Boats
    [15] = { slot = 10, weight = 0 }, -- Helicopters
    [16] = { slot = 10, weight = 0 }, -- Planes
    [17] = { slot = 10, weight = 0 }, -- Service
    [18] = { slot = 10, weight = 0 }, -- Emergency
    [19] = { slot = 10, weight = 0 }, -- Military
    [20] = { slot = 10, weight = 0 }, -- Commercial
    [21] = { slot = 10, weight = 0 }, -- Trains

    --- Override for specific vehicle

    -- Tankers
    [GetHashKey('tanker')] = { slot = 5, weight = 550000 },
    [GetHashKey('tanker2')] = { slot = 5, weight = 550000 },

    -- BlueBird
    [GetHashKey('trash')] = { slot = 10, weight = 200000 },

    -- STONKS
    [GetHashKey('stockade')] = { slot = 10, weight = 500000 },

}

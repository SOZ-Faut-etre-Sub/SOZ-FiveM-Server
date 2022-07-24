QBShared          = QBShared or {}

QBShared.Trunks = {
    --- Default GTA Vehicle Class
    [0] = { slot = 10, weight = 20000 }, -- Compacts
    [1] = { slot = 10, weight = 60000 }, -- Sedans
    [2] = { slot = 10, weight = 80000 }, -- SUVs
    [3] = { slot = 10, weight = 40000 }, -- Coupes
    [4] = { slot = 10, weight = 30000 }, -- Muscle
    [5] = { slot = 10, weight = 20000 }, -- Sports Classics
    [6] = { slot = 10, weight = 20000 }, -- Sports
    [7] = { slot = 10, weight = 20000 }, -- Super
    [8] = { slot = 10, weight = 10000 }, -- Motorcycles
    [9] = { slot = 10, weight = 100000 }, -- Off-road
    [10] = { slot = 10, weight = 0 }, -- Industrial
    [11] = { slot = 10, weight = 0 }, -- Utility
    [12] = { slot = 10, weight = 200000 }, -- Vans
    [13] = { slot = 10, weight = 2000 }, -- Cycles
    [14] = { slot = 10, weight = 100000 }, -- Boats
    [15] = { slot = 10, weight = 100000 }, -- Helicopters
    [16] = { slot = 10, weight = 0 }, -- Planes
    [17] = { slot = 10, weight = 0 }, -- Service
    [18] = { slot = 10, weight = 0 }, -- Emergency
    [19] = { slot = 10, weight = 0 }, -- Military
    [20] = { slot = 10, weight = 0 }, -- Commercial
    [21] = { slot = 10, weight = 0 }, -- Trains

    --- Override for specific vehicle

    --- Vans
    [GetHashKey('moonbeam')] = { slot = 10, weight = 200000 },
    [GetHashKey('moonbeam2')] = { slot = 10, weight = 200000 },

    --- LSPD
    [GetHashKey('police5')] = { slot = 5, weight = 80000 },
    [GetHashKey('police6')] = { slot = 5, weight = 80000 },
    [GetHashKey('policeb')] = { slot = 5, weight = 30000 },
    [GetHashKey('polmav')] = { slot = 5, weight = 200000 },

    --- BCSO
    [GetHashKey('sheriff3')] = { slot = 5, weight = 60000 },
    [GetHashKey('sheriff4')] = { slot = 5, weight = 80000 },
    [GetHashKey('sheriffb')] = { slot = 5, weight = 30000 },
    [GetHashKey('maverick2')] = { slot = 5, weight = 200000 },

    --- LSMC
    [GetHashKey('ambulance')] = { slot = 5, weight = 100000 },
    [GetHashKey('ambcar')] = { slot = 5, weight = 80000 },
    [GetHashKey('firetruk')] = { slot = 5, weight = 80000 },
    [GetHashKey('polmav')] = { slot = 5, weight = 200000 },

    -- STONKS
    [GetHashKey('stockade')] = { slot = 10, weight = 200000 },
    [GetHashKey('baller8')] = { slot = 10, weight = 80000 },

    -- Twitch News
    [GetHashKey('newsvan')] = { slot = 10, weight = 100000 },
    [GetHashKey('frogger3')] = { slot = 10, weight = 200000 },

    -- Chateau Marius
    [GetHashKey('mule6')] = { slot = 10, weight = 400000 },
    [GetHashKey('taco1')] = { slot = 10, weight = 100000 },

    -- Michel Transport Petrol
    [GetHashKey('packer2')] = { slot = 5, weight = 40000 },
    [GetHashKey('tanker')] = { slot = 5, weight = 550000 },
    [GetHashKey('utillitruck4')] = { slot = 5, weight = 100000 },

    -- CarlJr Service
    [GetHashKey('dynasty2')] = { slot = 10, weight = 40000 },

    -- Benny's
    [GetHashKey('flatbed3')] = { slot = 10, weight = 40000 },
    [GetHashKey('burito6')] = { slot = 10, weight = 100000 },

    -- BlueBird
    [GetHashKey('trash')] = { slot = 10, weight = 200000 },

    -- Pole Emploi
    [GetHashKey('scrap')] = { slot = 10, weight = 100000 },
    [GetHashKey('faggio4')] = { slot = 10, weight = 20000 },
    [GetHashKey('fixter')] = { slot = 10, weight = 5000 },

    -- Pawl
    [GetHashKey('hauler1')] = { slot = 10, weight = 40000 },
    [GetHashKey('sadler1')] = { slot = 10, weight = 80000 },
    [GetHashKey('trailerlogs')] = { slot = 10, weight = 200000 },

    -- UPW
    [GetHashKey('boxville')] = { slot = 10, weight = 50000 },
    [GetHashKey('brickade1')] = { slot = 10, weight = 100000 },

    -- BAUN
    [GetHashKey('youga3')] = { slot = 10, weight = 40000 },
}

FoodConfig = {}

FoodConfig.Blip = {Name = "Château Marius", Icon = 176, Coords = vector2(-1889.54, 2045.27), Scale = 1.0}

FoodConfig.BossShop = {
    [1] = {name = "weapon_machete", metadata = {}, price = 45, amount = 1},
    [2] = {name = "weapon_musket", metadata = {}, price = 125, amount = 1},
    [3] = {name = "shotgun_ammo", metadata = {}, price = 10, amount = 1},
}

FoodConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {
        ["Tenue de travail"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 0, Texture = 0, Palette = 0},
                [4] = {Drawable = 90, Texture = 0, Palette = 0},
                [6] = {Drawable = 51, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 15, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 0, Texture = 2, Palette = 0},
            },
            Props = {},
        },
        ["Tenue de prestation"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 14, Texture = 0, Palette = 0},
                [4] = {Drawable = 35, Texture = 0, Palette = 0},
                [6] = {Drawable = 20, Texture = 3, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 25, Texture = 3, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 4, Texture = 0, Palette = 0},
            },
            Props = {},
        },
    },

    [GetHashKey("mp_f_freemode_01")] = {
        ["Tenue de travail"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 0, Texture = 0, Palette = 0},
                [4] = {Drawable = 93, Texture = 0, Palette = 0},
                [6] = {Drawable = 52, Texture = 0, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 1, Texture = 0, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 73, Texture = 1, Palette = 0},
            },
            Props = {},
        },
        ["Tenue de prestation"] = {
            Components = {
                [1] = {Drawable = 0, Texture = 0, Palette = 0},
                [3] = {Drawable = 3, Texture = 0, Palette = 0},
                [4] = {Drawable = 34, Texture = 0, Palette = 0},
                [6] = {Drawable = 29, Texture = 1, Palette = 0},
                [7] = {Drawable = 0, Texture = 0, Palette = 0},
                [8] = {Drawable = 40, Texture = 7, Palette = 0},
                [9] = {Drawable = 0, Texture = 0, Palette = 0},
                [10] = {Drawable = 0, Texture = 0, Palette = 0},
                [11] = {Drawable = 7, Texture = 0, Palette = 0},
            },
            Props = {},
        },
    },
}

FoodConfig.Collect = {
    Grape = {
        Duration = 10000, -- in ms
    },
    Milk = {
        Duration = 10000, -- in ms
        Reward = {min = 1, max = 4},
        Item = "milk",
    },
}

FoodConfig.Categories = {
    ["wine"] = {icon = "https://nui-img/soz-items/wine", label = "Vins"},
    ["grapejuice"] = {icon = "https://nui-img/soz-items/grapejuice", label = "Jus"},
    ["cheese"] = {icon = "🧀", label = "Fromages"},
    ["sausage"] = {icon = "🐖", label = "Saucissons"},
}

FoodConfig.Fields = {
    ["cardinal"] = {
        prodRange = {min = 250, max = 400},
        harvestRange = {min = 3, max = 5},
        refillDelay = 60000, -- in ms
        item = "grape1",
    },
    ["muscat"] = {
        prodRange = {min = 400, max = 600},
        harvestRange = {min = 3, max = 5},
        refillDelay = 60000, -- in ms
        item = "grape2",
    },
    ["centennial"] = {
        prodRange = {min = 400, max = 600},
        harvestRange = {min = 3, max = 5},
        refillDelay = 60000, -- in ms
        item = "grape3",
    },
    ["chasselas"] = {
        prodRange = {min = 400, max = 600},
        harvestRange = {min = 3, max = 5},
        refillDelay = 60000, -- in ms
        item = "grape4",
    },
}
FoodConfig.RefillLoopDelay = 60000 -- in ms

FoodConfig.Zones = {
    ["cardinal1"] = {
        vector3(-1871.85, 2096.73, 139.68),
        vector3(-1915.77, 2102.04, 131.1),
        vector3(-1911.11, 2154.06, 113.14),
        vector3(-1885.06, 2168.62, 114.58),
        vector3(-1865.37, 2168.76, 116.59),
        vector3(-1836.61, 2154.18, 115.13),
        vector3(-1846.81, 2125.8, 128.98),
    },
    ["cardinal2"] = {
        vector3(-1865.56, 2094.32, 138.71),
        vector3(-1839.72, 2126.85, 126.11),
        vector3(-1830.0, 2148.44, 117.63),
        vector3(-1752.45, 2153.37, 122.46),
        vector3(-1795.58, 2122.2, 132.89),
        vector3(-1825.3, 2107.91, 138.2),
    },
    ["cardinal3"] = {
        vector3(-1857.22, 2087.94, 139.76),
        vector3(-1840.31, 2064.19, 137.82),
        vector3(-1809.84, 2060.25, 131.7),
        vector3(-1787.7, 2072.71, 127.25),
        vector3(-1725.23, 2129.73, 112.96),
        vector3(-1683.7, 2159.84, 108.24),
        vector3(-1752.54, 2143.48, 124.84),
        vector3(-1799.75, 2114.22, 134.47),
        vector3(-1827.21, 2104.17, 137.95),
    },
    ["cardinal4"] = {
        vector3(-1827.85, 2157.13, 115.01),
        vector3(-1706.24, 2161.83, 113.81),
        vector3(-1673.95, 2174.04, 104.61),
        vector3(-1668.41, 2190.95, 99.42),
        vector3(-1757.24, 2222.6, 93.85),
        vector3(-1795.7, 2223.11, 90.28),
        vector3(-1821.52, 2208.87, 90.23),
        vector3(-1813.88, 2183.73, 100.71),
    },
    ["cardinal5"] = {
        vector3(-1898.9, 2179.73, 106.12),
        vector3(-1835.76, 2167.8, 112.54),
        vector3(-1823.58, 2185.95, 100.53),
        vector3(-1835.82, 2213.02, 87.76),
        vector3(-1861.25, 2227.33, 88.23),
        vector3(-1885.35, 2231.39, 86.59),
        vector3(-1902.16, 2227.31, 84.0),
    },
    ["cardinal6"] = {
        vector3(-1833.85, 2228.59, 82.92),
        vector3(-1828.83, 2267.63, 71.48),
        vector3(-1844.77, 2279.71, 72.2),
        vector3(-1872.21, 2283.27, 69.41),
        vector3(-1903.37, 2273.18, 66.56),
        vector3(-1902.7, 2240.77, 80.5),
    },
    ["cardinal7"] = {
        vector3(-1739.97, 2232.94, 91.14),
        vector3(-1742.05, 2262.85, 82.7),
        vector3(-1763.4, 2275.6, 78.54),
        vector3(-1798.04, 2276.11, 72.99),
        vector3(-1824.42, 2258.36, 72.14),
        vector3(-1828.19, 2222.89, 84.84),
        vector3(-1814.31, 2222.92, 86.47),
        vector3(-1793.29, 2231.44, 89.06),
    },
    ["muscat1"] = {
        vector3(-1678.38, 2243.62, 84.45),
        vector3(-1693.58, 2261.61, 77.39),
        vector3(-1678.81, 2290.24, 64.74),
        vector3(-1636.86, 2321.15, 52.59),
        vector3(-1597.79, 2321.38, 59.95),
        vector3(-1592.72, 2310.06, 61.83),
        vector3(-1594.94, 2267.92, 69.13),
        vector3(-1571.96, 2239.93, 68.54),
        vector3(-1572.89, 2188.84, 71.63),
        vector3(-1606.76, 2186.55, 83.21),
        vector3(-1647.72, 2231.46, 87.61),
    },
    ["muscat2"] = {
        vector3(-1695.96, 2285.13, 69.05),
        vector3(-1652.74, 2331.4, 50.54),
        vector3(-1702.62, 2368.64, 49.58),
        vector3(-1749.69, 2386.66, 44.8),
        vector3(-1808.51, 2350.73, 45.04),
        vector3(-1804.08, 2334.4, 50.5),
        vector3(-1728.63, 2304.14, 74.21),
        vector3(-1718.46, 2294.02, 74.55),
    },
    ["centennial1"] = {
        vector3(-1683.7, 1947.37, 135.99),
        vector3(-1685.07, 1987.72, 129.03),
        vector3(-1688.2, 2038.36, 113.13),
        vector3(-1713.76, 2042.82, 111.11),
        vector3(-1738.22, 2000.17, 117.83),
        vector3(-1739.66, 1972.64, 121.04),
        vector3(-1700.58, 1917.88, 148.68),
    },
    ["centennial2"] = {
        vector3(-1790.51, 1928.98, 131.69),
        vector3(-1780.74, 1892.72, 148.59),
        vector3(-1762.62, 1885.49, 153.12),
        vector3(-1710.42, 1885.7, 161.43),
        vector3(-1703.07, 1902.72, 154.19),
        vector3(-1723.41, 1931.36, 136.49),
        vector3(-1728.24, 1949.47, 127.65),
        vector3(-1751.85, 1982.13, 117.59),
        vector3(-1778.08, 1949.03, 126.84),
    },
    ["chasselas1"] = {
        vector3(-1856.86, 1931.54, 149.57),
        vector3(-1898.45, 1970.04, 143.84),
        vector3(-1971.52, 1964.08, 156.39),
        vector3(-1982.89, 1955.89, 164.48),
        vector3(-1983.58, 1942.88, 169.52),
        vector3(-1944.91, 1919.17, 172.67),
        vector3(-1936.74, 1905.66, 175.99),
        vector3(-1923.77, 1895.83, 174.57),
        vector3(-1888.29, 1909.69, 163.42),
    },
    ["chasselas2"] = {
        vector3(-1851.0, 1924.08, 150.91),
        vector3(-1890.64, 1902.23, 165.86),
        vector3(-1912.73, 1894.81, 172.56),
        vector3(-1937.88, 1876.32, 180.87),
        vector3(-1952.49, 1839.34, 180.56),
        vector3(-1946.66, 1822.47, 172.59),
        vector3(-1838.28, 1900.16, 145.2),
    },
}

FoodConfig.HuntingWeapon = GetHashKey("weapon_machete")
FoodConfig.AnimalAllowedToHunt = {
    [GetHashKey("a_c_boar")] = true,
    [GetHashKey("a_c_chickenhawk")] = true,
    [GetHashKey("a_c_cormorant")] = true,
    [GetHashKey("a_c_cow")] = true,
    [GetHashKey("a_c_coyote")] = true,
    [GetHashKey("a_c_crow")] = true,
    [GetHashKey("a_c_deer")] = true,
    [GetHashKey("a_c_hen")] = true,
    [GetHashKey("a_c_mtlion")] = true,
    [GetHashKey("a_c_pig")] = true,
    [GetHashKey("a_c_pigeon")] = true,
    [GetHashKey("a_c_rabbit_01")] = true,
    [GetHashKey("a_c_seagull")] = true,
}
FoodConfig.HuntingReward = {
    ["peau"] = {min = 0, max = 2},
    ["os"] = {min = 0, max = 2},
    ["viscere"] = {min = 0, max = 2},
    ["tripe"] = {min = 1, max = 4},
    ["viande"] = {min = 2, max = 5},
    ["langue"] = {min = 1, max = 3},
    ["abat"] = {min = 1, max = 3},
    ["rognon"] = {min = 1, max = 3},
}

FoodConfig.CraftDuration = {["default"] = 4000, ["sausage"] = 8000, ["wine"] = 20000}

FoodConfig.Recipes = {
    -- WINES
    ["wine1"] = {category = "wine", ingredients = {["grape1"] = 10}},
    ["wine2"] = {category = "wine", ingredients = {["grape2"] = 10}},
    ["wine3"] = {category = "wine", ingredients = {["grape3"] = 10}},
    ["wine4"] = {category = "wine", ingredients = {["grape4"] = 10}},
    -- JUICES
    ["grapejuice1"] = {category = "grapejuice", ingredients = {["grape1"] = 2}},
    ["grapejuice2"] = {category = "grapejuice", ingredients = {["grape2"] = 2}},
    ["grapejuice3"] = {category = "grapejuice", ingredients = {["grape3"] = 2}},
    ["grapejuice4"] = {
        category = "grapejuice",
        ingredients = {["grape1"] = 1, ["grape2"] = 1, ["grape3"] = 1, ["grape4"] = 1},
    },
    ["grapejuice5"] = {category = "grapejuice", ingredients = {["grape4"] = 2}},
    -- CHEESES
    ["cheese1"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese2"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese3"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese4"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese5"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese6"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese7"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese8"] = {category = "cheese", ingredients = {["milk"] = 2}},
    ["cheese9"] = {category = "cheese", ingredients = {["milk"] = 2}},
    -- SAUSAGES
    ["sausage1"] = {
        category = "sausage",
        ingredients = {["tripe"] = 4, ["viande"] = 1, ["langue"] = 1, ["abat"] = 1, ["rognon"] = 1},
    },
    ["sausage2"] = {
        category = "sausage",
        ingredients = {["tripe"] = 4, ["viande"] = 1, ["langue"] = 1, ["abat"] = 1, ["rognon"] = 1},
    },
    ["sausage3"] = {
        category = "sausage",
        ingredients = {["tripe"] = 4, ["viande"] = 1, ["langue"] = 1, ["abat"] = 1, ["rognon"] = 1},
    },
    ["sausage4"] = {
        category = "sausage",
        ingredients = {["tripe"] = 4, ["viande"] = 1, ["langue"] = 1, ["abat"] = 1, ["rognon"] = 1},
    },
    ["sausage5"] = {
        category = "sausage",
        ingredients = {["tripe"] = 4, ["viande"] = 1, ["langue"] = 1, ["abat"] = 1, ["rognon"] = 1},
    },
}

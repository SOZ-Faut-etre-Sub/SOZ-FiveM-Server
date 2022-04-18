FoodConfig = {}

FoodConfig.Blip = {Name = "Château Marius", Icon = 176, Coords = vector2(-1889.54, 2045.27), Scale = 1.0}

FoodConfig.Cloakroom = {
    [GetHashKey("mp_m_freemode_01")] = {Components = {}, Props = {}},
    [GetHashKey("mp_f_freemode_01")] = {Components = {}, Props = {}},
}

FoodConfig.Collect = {
    Duration = 15000, -- in ms
    Range = {min = 1, max = 3},
    Items = {"grape"},
}

FoodConfig.Categories = {
    ["alcohol"] = {icon = "🍾", label = "Boissons alcolisées"},
    ["softdrink"] = {icon = "🥤", label = "Boissons non alcolisées"},
}

FoodConfig.Zones = {
    ["cardinal"] = {
        vector3(-1870.79, 2092.71, 139.9),
        vector3(-1918.71, 2100.97, 132.1),
        vector3(-1907.34, 2162.48, 111.57),
        vector3(-1903.72, 2229.07, 83.28),
        vector3(-1902.63, 2277.44, 65.88),
        vector3(-1858.99, 2284.97, 70.8),
        vector3(-1818.9, 2266.48, 70.47),
        vector3(-1799.39, 2277.28, 72.09),
        vector3(-1770.21, 2278.29, 77.7),
        vector3(-1740.29, 2261.42, 83.66),
        vector3(-1738.04, 2216.86, 94.03),
        vector3(-1665.04, 2190.51, 99.19),
        vector3(-1690.11, 2151.84, 109.19),
        vector3(-1747.36, 2110.55, 116.64),
        vector3(-1794.35, 2065.08, 127.74),
        vector3(-1837.23, 2058.81, 137.6),
        vector3(-1859.89, 2089.45, 139.81),
    },
    ["muscat"] = {
        vector3(-1678.38, 2243.62, 84.45),
        vector3(-1722.08, 2297.23, 75.51),
        vector3(-1805.2, 2332.98, 52.3),
        vector3(-1806.51, 2352.55, 44.08),
        vector3(-1754.87, 2388.65, 44.64),
        vector3(-1697.57, 2367.01, 50.83),
        vector3(-1648.53, 2324.86, 50.72),
        vector3(-1597.79, 2321.38, 59.95),
        vector3(-1592.72, 2310.06, 61.83),
        vector3(-1594.94, 2267.92, 69.13),
        vector3(-1571.65, 2232.08, 67.29),
        vector3(-1572.89, 2188.84, 71.63),
        vector3(-1606.76, 2186.55, 83.21),
        vector3(-1647.72, 2231.46, 87.61),
    },
    ["centennial"] = {
        vector3(-1765.68, 1883.03, 153.16),
        vector3(-1712.34, 1884.9, 161.28),
        vector3(-1699.5, 1910.39, 150.62),
        vector3(-1683.7, 1947.37, 135.99),
        vector3(-1685.07, 1987.72, 129.03),
        vector3(-1688.2, 2038.36, 113.13),
        vector3(-1713.76, 2042.82, 111.11),
        vector3(-1745.73, 1986.73, 118.26),
        vector3(-1772.84, 1957.9, 124.8),
        vector3(-1790.01, 1930.8, 130.92),
        vector3(-1780.37, 1895.65, 146.06),
    },
    ["chasselas"] = {
        vector3(-1833.6, 1901.67, 151.03),
        vector3(-1875.84, 1951.82, 148.21),
        vector3(-1903.79, 1971.76, 147.01),
        vector3(-1970.97, 1966.0, 156.56),
        vector3(-1988.23, 1943.67, 170.37),
        vector3(-1943.61, 1913.96, 174.16),
        vector3(-1924.0, 1893.62, 176.21),
        vector3(-1938.74, 1878.4, 180.23),
        vector3(-1955.66, 1834.22, 178.81),
        vector3(-1941.54, 1821.85, 172.73),
        vector3(-1911.39, 1847.27, 164.79),
    },
}

FoodConfig.Recipes = {
    -- ALCOHOL
    ["wine"] = {category = "alcohol", icon = "🍷", ingredients = {["grape"] = 3}},
    -- SOFT DRINKS
    ["grapejuice"] = {category = "softdrink", icon = "🧃", ingredients = {["grape"] = 2}},
}

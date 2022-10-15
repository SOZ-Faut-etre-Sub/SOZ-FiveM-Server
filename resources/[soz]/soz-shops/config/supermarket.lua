Config.Products["supermarket"] = {
    [1] = {name = "sandwich", price = 4, amount = 2000},
    [2] = {name = "water_bottle", price = 2, amount = 2000},
    [3] = {name = "gps", price = 20, amount = 2000},
    [4] = {name = "compass", price = 15, amount = 2000},
    [5] = {name = "binoculars", price = 8, amount = 2000},
    [6] = {name = "phone", price = 499, amount = 2000},
    [7] = {name = "diving_gear", price = 2600, amount = 2000},
}

Config.Products["247supermarket-north"] = Config.Products["supermarket"]
Config.Products["247supermarket-south"] = Config.Products["supermarket"]
Config.Products["ltdgasoline-north"] = Config.Products["supermarket"]
Config.Products["ltdgasoline-south"] = Config.Products["supermarket"]
Config.Products["robsliquor-north"] = Config.Products["supermarket"]
Config.Products["robsliquor-south"] = Config.Products["supermarket"]

Config.Products["zkea"] = {[1] = {name = "house_map", price = 15, amount = 2000}}

Config.Locations["247supermarket-north"] = {
    vector4(1727.7, 6415.4, 35.04, 237.95),
    vector4(1959.84, 3739.86, 32.34, 299.67),
    vector4(549.28, 2671.37, 42.16, 98.65),
    vector4(2677.93, 3279.31, 55.24, 333.41),
    vector4(-2539.29, 2313.75, 33.41, 94.82),
    vector4(160.43, 6641.72, 31.71, 222.18),
}
Config.Locations["247supermarket-south"] = {
    vector4(24.14, -1347.22, 29.5, 273.39),
    vector4(-3038.86, 584.36, 7.91, 22.65),
    vector4(-3242.29, 999.76, 12.83, 0.41),
    vector4(2557.18, 380.64, 108.62, 1.74),
    vector4(372.45, 326.52, 103.57, 254.29),
}

Config.Locations["ltdgasoline-north"] = {vector4(1698.2, 4922.86, 42.06, 324.94)}
Config.Locations["ltdgasoline-south"] = {
    vector4(-46.7, -1757.9, 29.42, 49.1),
    vector4(-706.16, -913.5, 19.22, 88.63),
    vector4(-1820.21, 794.29, 138.09, 126.03),
    vector4(1164.68, -322.59, 69.21, 110.25),
    vector4(-1421.6, -270.53, 46.3, 51.58),
    vector4(-2070.26, -333.33, 13.32, 357.19),
}

Config.Locations["robsliquor-north"] = {
    vector4(1165.93, 2710.81, 38.16, 180.89),
    vector4(-162.81, 6323.02, 31.59, 322.62),
}
Config.Locations["robsliquor-south"] = {
    vector4(-1222.01, -908.37, 12.33, 31.52),
    vector4(-1486.2, -378.01, 40.16, 135.93),
    vector4(-2966.38, 390.94, 15.04, 86.14),
    vector4(1134.15, -982.51, 46.42, 281.3),
}

Config.Locations["zkea"] = {vector4(2748.29, 3472.55, 55.68, 254.93)}

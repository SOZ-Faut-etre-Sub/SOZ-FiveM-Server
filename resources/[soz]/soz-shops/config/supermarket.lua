Config.Products["supermarket"] = {
    [1] = {name = "sandwich", price = 4, amount = 2000},
    [2] = {name = "water_bottle", price = 2, amount = 2000},
    [3] = {name = "gps", price = 20, amount = 2000},
    [4] = {name = "compass", price = 15, amount = 2000},
    [5] = {name = "binoculars", price = 8, amount = 2000},
    [6] = {name = "phone", price = 499, amount = 2000},
    [7] = {name = "diving_gear", price = 2600, amount = 2000},
    [8] = {name = "zpad", price = 2400, amount = 2000},
}

Config.Products["247supermarket-north"] = Config.Products["supermarket"]
Config.Products["247supermarket-south"] = Config.Products["supermarket"]
Config.Products["ltdgasoline-north"] = Config.Products["supermarket"]
Config.Products["ltdgasoline-south"] = Config.Products["supermarket"]
Config.Products["robsliquor-north"] = Config.Products["supermarket"]
Config.Products["robsliquor-south"] = Config.Products["supermarket"]

Config.Products["zkea"] = {[1] = {name = "house_map", price = 15, amount = 2000}}

Config.Locations["247supermarket-north"] = {
    ["247supermarket4"] = vector4(1728.33, 6416.87, 35.04, 237.95),
    ["247supermarket5"] = vector4(1958.92, 3741.33, 32.34, 299.67),
    ["247supermarket6"] = vector4(549.52, 2669.55, 42.16, 98.65),
    ["247supermarket7"] = vector4(2676.47, 3280.02, 55.24, 333.41),
    ["247supermarket10"] = vector4(-2539.01, 2312.00, 33.41, 94.82),
    ["247supermarket11"] = vector4(161.57, 6643.05, 31.71, 222.18),
}
Config.Locations["247supermarket-south"] = {
    ["247supermarket"] = vector4(24.17, -1345.49, 29.50, 273.39),
    ["247supermarket2"] = vector4(-3040.65, 583.85, 7.91, 22.65),
    ["247supermarket3"] = vector4(-3244.07, 999.89, 12.83, 0.41),
    ["247supermarket8"] = vector4(2555.43, 380.62, 108.62, 1.74),
    ["247supermarket9"] = vector4(372.86, 328.17, 103.57, 253.87),
}

Config.Locations["ltdgasoline-north"] = {["ltdgasoline5"] = vector4(1697.24, 4923.27, 42.06, 324.94)}
Config.Locations["ltdgasoline-south"] = {
    ["ltdgasoline"] = vector4(-47.22, -1758.73, 29.42, 49.1),
    ["ltdgasoline2"] = vector4(-705.96, -914.47, 19.22, 88.63),
    ["ltdgasoline3"] = vector4(-1819.42, 793.70, 138.08, 126.03),
    ["ltdgasoline4"] = vector4(1165.09, -323.52, 69.21, 110.25),
    ["ltdgasoline6"] = vector4(-1422.39, -271.12, 46.28, 51.58),
    ["ltdgasoline7"] = vector4(-2071.21, -333.42, 13.32, 357.19),
}

Config.Locations["robsliquor-north"] = {
    ["robsliquor4"] = vector4(1165.26, 2710.93, 38.16, 180.89),
    ["robsliquor6"] = vector4(-162.42, 6322.55, 31.59, 322.62),
}
Config.Locations["robsliquor-south"] = {
    ["robsliquor"] = vector4(-1221.34, -908.13, 12.33, 31.52),
    ["robsliquor2"] = vector4(-1486.60, -377.43, 40.16, 135.93),
    ["robsliquor3"] = vector4(-2966.06, 391.64, 15.04, 86.14),
    ["robsliquor5"] = vector4(1134.02, -983.14, 46.42, 281.3),
}

Config.Locations["zkea"] = {["zkea"] = vector4(2748.29, 3472.55, 55.68, 254.93)}

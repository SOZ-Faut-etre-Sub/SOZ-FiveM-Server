Config.Products["ponsonbys"] = {
    [GetHashKey("mp_m_freemode_01")] = {
        [1] = {
            Name = "Chaussures",
            Collections = {
                [1] = {
                    Name = "Basket",
                    Price = 50,
                    Items = {
                        [1] = {
                            Name = GetLabelText("CLO_BHM_F_1_18"),
                            Components = {[6] = {Drawable = 75, Texture = 18, Palette = 0}},
                        },
                        [2] = {
                            Name = GetLabelText("CLO_BHM_F_1_19"),
                            Components = {[6] = {Drawable = 75, Texture = 19, Palette = 0}},
                        },
                        [3] = {
                            Name = GetLabelText("CLO_BHM_F_1_3"),
                            Components = {[6] = {Drawable = 76, Texture = 3, Palette = 0}},
                        },
                    },
                },
            },
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {},
}

Config.Products["suburban"] = {[GetHashKey("mp_m_freemode_01")] = {}, [GetHashKey("mp_f_freemode_01")] = {}}

Config.Products["binco"] = {[GetHashKey("mp_m_freemode_01")] = {}, [GetHashKey("mp_f_freemode_01")] = {}}

Config.ClothingLocationsInShop = {
    ["ponsonbys1"] = vector4(-704.75, -151.61, 37.42, 200.16),
    ["ponsonbys2"] = vector4(-167.72, -299.38, 39.73, 336.42),
    ["ponsonbys3"] = vector4(-1447.86, -242.37, 49.82, 144.64),
    ["suburban1"] = vector4(118.16, -227.36, 54.56, 246.27),
    ["suburban2"] = vector4(620.16, 2769.12, 42.09, 93.65),
    ["suburban3"] = vector4(-1184.8, -769.37, 17.33, 40.76),
    ["suburban4"] = vector4(-3178.63, 1040.59, 20.86, 249.91),
    ["binco1"] = vector4(429.73, -811.43, 29.49, 355.47),
    ["binco2"] = vector4(-819.89, -1067.32, 11.33, 115.96),
    ["binco3"] = vector4(71.21, -1387.51, 29.38, 181.94),
    ["binco4"] = vector4(3.69, 6505.76, 31.88, 310.2),
    ["binco5"] = vector4(1698.71, 4818.05, 42.06, 6.41),
    ["binco6"] = vector4(1202.14, 2714.29, 38.22, 91.37),
    ["binco7"] = vector4(-1100.12, 2717.23, 19.11, 129.32),
}

Config.Locations["ponsonbys"] = {
    vector4(-708.9, -151.38, 37.42, 125.7),
    vector4(-165.28, -303.18, 39.73, 256.5),
    vector4(-1448.54, -238.02, 49.81, 50.99),
}

Config.Locations["suburban"] = {
    vector4(127.21, -224.29, 54.56, 71.99),
    vector4(612.77, 2762.72, 42.09, 273.74),
    vector4(-1193.98, -766.84, 17.32, 216.9),
    vector4(-3169.27, 1043.23, 20.86, 70.68),
}

Config.Locations["binco"] = {
    vector4(427.23, -807.14, 29.49, 87.53),
    vector4(-822.51, -1071.78, 11.33, 208.86),
    vector4(73.8, -1392.08, 29.38, 268.02),
    vector4(5.33, 6510.79, 31.88, 47.79),
    vector4(1695.52, 4822.3, 42.06, 114.62),
    vector4(1197.49, 2711.92, 38.22, 179.31),
    vector4(-1101.93, 2712.25, 19.11, 229.23),
}

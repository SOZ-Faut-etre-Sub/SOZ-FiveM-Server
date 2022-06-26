if GetConvarInt("feature_dlc1_weapon", 0) == 1 then
    Config.Products["ammunation"] = {
        [1] = {name = "parachute", type = "item", price = 250, amount = 250},
        [2] = {name = "weapon_bat", type = "item", price = 180, amount = 250},
        [3] = {name = "weapon_golfclub", type = "item", price = 450, amount = 250},
        [4] = {name = "weapon_knuckle", type = "item", price = 100, amount = 250},
        [5] = {name = "weapon_poolcue", type = "item", price = 200, amount = 250}
    }
else
    Config.Products["ammunation"] = {
        [1] = {name = "parachute", type = "item", price = 250, amount = 250}
    }
end

Config.Locations["ammunation"] = {
    vector4(-661.61, -933.49, 21.83, 176.46),
    vector4(809.58, -2159.08, 29.62, 359.76),
    vector4(1692.65, 3761.4, 34.71, 225.95),
    vector4(-331.22, 6085.34, 31.45, 225.39),
    vector4(253.6, -51.11, 69.94, 64.6),
    vector4(23.06, -1105.72, 29.8, 162.29),
    vector4(2567.43, 292.62, 108.73, 1.02),
    vector4(-1118.56, 2700.09, 18.55, 229.33),
    vector4(841.8, -1035.26, 28.19, 356.67),
}

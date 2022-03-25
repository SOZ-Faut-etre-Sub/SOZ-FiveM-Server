Config = {}
Config.MaxWeight = 80000 -- Max weight a player can carry (currently 120kg, written in grams)
Config.MaxInvSlots = 30 -- Max inventory slots for a player

Config.ErrorMessage = {
    ["invalid_item"] = "~r~L'objet a transférer est invalide !",
    ["invalid_inventory"] = "~r~L'inventaire n'est pas disponible !",
    ["invalid_quantity"] = "~r~La quantité indiqué n'est pas valide",
    ["nonexistent_item"] = "~r~L'objet a transférer est invalide !",
    ["inventory_full"] = "~r~L'inventaire n'a plus de place !",
    ["not_allowed_item"] = "~r~L'objet ne peut aller dans ce stockage !",
}

Config.StorageMaxWeight = 250000
Config.StorageMaxInvSlots = 10
Config.Storages = {}

Config.BinLocation = {
    vector4(642.94, 11.42, 81.79, 252.99), -- LSPD
    vector4(-445.04, 6022.39, 30.49, 323.87), -- BCSO
    vector4(289.33, -1369.08, 30.93, 231.78), -- LSMC
    vector4(14.38, -1117.13, 27.88, 159.51), -- Ammu-NAtion
}

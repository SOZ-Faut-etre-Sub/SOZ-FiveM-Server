Config = {}
Config.MaxWeight = 80000 -- Max weight a player can carry (currently 120kg, written in grams)
Config.MaxInvSlots = 30 -- Max inventory slots for a player

Config.ErrorMessage = {
    ["invalid_item"] = "L'objet a transférer est invalide !",
    ["invalid_inventory"] = "L'inventaire n'est pas disponible !",
    ["invalid_quantity"] = "La quantité indiqué n'est pas valide",
    ["nonexistent_item"] = "L'objet a transférer est invalide !",
    ["inventory_full"] = "L'inventaire n'a plus de place !",
    ["not_allowed_item"] = "L'objet ne peut aller dans ce stockage !",
}

Config.StorageMaxWeight = 250000
Config.StorageMaxInvSlots = 10
Config.Storages = {}

Config = {}
Config.MaxWeight = 80000 -- Max weight a player can carry (currently 120kg, written in grams)
Config.MaxInvSlots = 30 -- Max inventory slots for a player

Config.ErrorMessage = {
    ['invalid_item'] = "~r~L'objet a transférer est invalide !",
    ['invalid_inventory'] = "~r~L'inventaire n'est pas disponible !",
    ['nonexistent_item'] = "~r~L'objet a transférer est invalide !",
    ['inventory_full'] = "~r~L'inventaire n'a plus de place !",
    ['not_allowed_item'] = "~r~L'objet ne peut aller dans ce stockage !",
}

Config.StorageMaxWeight = 250000
Config.StorageMaxInvSlots = 10
Config.Storages = {}
Config = {}

Config.StorageCapacity = {
    ["default"] = {slot = 10, weight = 25000},
    ["player"] = {slot = 30, weight = 80000},
    ["bin"] = {slot = 10, weight = 10000},
    --- society storages
    ["ammo"] = {slot = 100, weight = 250000},
    ["armory"] = {slot = 100, weight = 250000},
    ["boss_storage"] = {slot = 100, weight = 250000},
    ["fridge"] = {slot = 100, weight = 250000},
    ["organ"] = {slot = 100, weight = 250000},
    ["seizure"] = {slot = 100, weight = 250000},
    ["storage"] = {slot = 100, weight = 250000},
    ["storage_tank"] = {slot = 10, weight = 250000},
}

Config.ErrorMessage = {
    ["invalid_item"] = "L'objet a transférer est invalide !",
    ["invalid_inventory"] = "L'inventaire n'est pas disponible !",
    ["invalid_quantity"] = "La quantité indiqué n'est pas valide",
    ["nonexistent_item"] = "L'objet a transférer est invalide !",
    ["inventory_full"] = "L'inventaire n'a plus de place !",
    ["not_allowed_item"] = "L'objet ne peut aller dans ce stockage !",
}

Config.Storages = {}

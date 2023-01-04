Config = {}

Config.StorageCapacity = {
    ["default"] = {slot = 10, weight = 25000},
    ["player"] = {slot = 30, weight = 20000},
    ["bin"] = {slot = 10, weight = 25000},
    --- society storages
    ["ammo"] = {slot = 100, weight = 10000000},
    ["armory"] = {slot = 100, weight = 10000000},
    ["boss_storage"] = {slot = 100, weight = 10000000},
    ["fridge"] = {slot = 100, weight = 10000000},
    ["organ"] = {slot = 100, weight = 10000000},
    ["seizure"] = {slot = 100, weight = 10000000},
    ["storage"] = {slot = 100, weight = 10000000},
    ["storage_tank"] = {slot = 10, weight = 10000000},
    ["cloakroom"] = {slot = 10, weight = 1000000},
    --- houses
    ["house_stash"] = {slot = 10, weight = 100000},
    ["house_fridge"] = {slot = 10, weight = 100000},
    --- Jobs PAWL
    ["log_storage"] = {slot = 10, weight = 20000000},
    ["plank_storage"] = {slot = 10, weight = 1000000},
    ["sawdust_storage"] = {slot = 10, weight = 1000000},
    ["log_processing"] = {slot = 10, weight = 400000},
    --- Jobs UPW
    ["inverter"] = {slot = 100, weight = 2000000},
    --- Jobs BAUN
    ["flavor_storage"] = {slot = 100, weight = 400000},
    ["liquor_storage"] = {slot = 100, weight = 600000},
    ["furniture_storage"] = {slot = 100, weight = 200000},
    --- Jobs BlueBird
    ["recycler_processing"] = {slot = 100, weight = 400000},
    --- Zkea
    ["cabinet_storage"] = {slot = 1, weight = 1600000}, -- 400 cabinet_zkea maximum
}

Config.ErrorMessage = {
    ["invalid_amount"] = "La quantité à transférer est invalide !",
    ["invalid_item"] = "L'objet a transférer est invalide !",
    ["invalid_inventory"] = "L'inventaire n'est pas disponible !",
    ["invalid_quantity"] = "La quantité indiqué n'est pas valide",
    ["nonexistent_item"] = "L'objet à transférer est invalide !",
    ["inventory_full"] = "L'inventaire n'a plus de place !",
    ["not_allowed_item"] = "L'objet ne peut aller dans ce stockage !",
    ["get_not_allowed"] = "Ce stockage ne peut pas vous donner cet objet !",
    ["put_not_allowed"] = "Ce stockage ne peut pas accepter votre objet !",
}

Config.Storages = {}

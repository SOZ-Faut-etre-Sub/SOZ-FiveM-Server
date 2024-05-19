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
    ["seizure"] = {slot = 100, weight = 2000000},
    ["storage"] = {slot = 100, weight = 10000000},
    ["evidence_storage"] = {slot = 100, weight = 10000000},
    ["storage_tank"] = {slot = 10, weight = 10000000},
    ["cloakroom"] = {slot = 10, weight = 1000000},
    --- houses
    ["house_stash"] = {
        [-2] = {slot = 10, weight = 1000000000}, -- for GM House
        [0] = {slot = 10, weight = 200000},
        [1] = {slot = 10, weight = 400000},
        [2] = {slot = 10, weight = 600000},
        [3] = {slot = 10, weight = 800000},
        [4] = {slot = 10, weight = 1000000},
        [5] = {slot = 10, weight = 1400000},
        [6] = {slot = 10, weight = 1800000},
        [7] = {slot = 10, weight = 2000000},
        [8] = {slot = 10, weight = 3000000},
        [9] = {slot = 10, weight = 4000000},
    },
    ["house_fridge"] = {
        [-2] = {slot = 10, weight = 1000000000}, -- for GM House
        [0] = {slot = 10, weight = 200000},
        [1] = {slot = 10, weight = 400000},
        [2] = {slot = 10, weight = 600000},
        [3] = {slot = 10, weight = 800000},
        [4] = {slot = 10, weight = 1000000},
        [5] = {slot = 10, weight = 1400000},
        [6] = {slot = 10, weight = 1800000},
        [7] = {slot = 10, weight = 2000000},
        [8] = {slot = 10, weight = 3000000},
        [9] = {slot = 10, weight = 4000000},
    },
    --- Jobs PAWL
    ["log_storage"] = {slot = 10, weight = 40000000},
    ["plank_storage"] = {slot = 10, weight = 2000000},
    ["sawdust_storage"] = {slot = 10, weight = 2000000},
    ["log_processing"] = {slot = 10, weight = 400000},
    --- Jobs UPW
    ["inverter"] = {slot = 100, weight = 2000000},
    --- Jobs BAUN
    ["flavor_storage"] = {slot = 100, weight = 400000},
    ["liquor_storage"] = {slot = 100, weight = 600000},
    ["furniture_storage"] = {slot = 100, weight = 200000},
    ["snack_storage"] = {slot = 100, weight = 200000},
    --- Jobs BlueBird
    ["recycler_processing"] = {slot = 100, weight = 800000},
    --- Zkea
    ["cabinet_storage"] = {slot = 1, weight = 24000000}, -- 6000 cabinet_zkea maximum
    --- Smuggling Box
    ["smuggling_box"] = {slot = 100, weight = 200000},
    ["smuggling_blackmarket"] = {slot = 100, weight = 250000},
    ["smuggling_connected"] = {slot = 100, weight = 10000000},
    ["distillery"] = {slot = 100, weight = 48000},
    ["smuggling_export"] = {slot = 100, weight = 5000000},
    --- Jobs DMC
    ["metal_converter"] = {slot = 100, weight = 500000},
    ["metal_incinerator"] = {slot = 100, weight = 500000},
    ["metal_storage"] = {slot = 100, weight = 10000000},
    --- LS Custom
    ["ls_custom_storage"] = {slot = 1, weight = 800000}, -- 400 ls_custom_upgrade_part maximum
    ["object_storage"] = {slot = 100, weight = 10000000},
}

Config.ErrorMessage = {
    ["invalid_amount"] = "La quantité à transférer est invalide !",
    ["invalid_item"] = "L'objet à transférer est invalide !",
    ["invalid_inventory"] = "L'inventaire n'est pas disponible !",
    ["invalid_quantity"] = "La quantité indiquée n'est pas valide",
    ["nonexistent_item"] = "L'objet à transférer est invalide !",
    ["inventory_full"] = "L'inventaire n'a plus de place !",
    ["not_allowed_item"] = "L'objet ne peut pas aller dans ce stockage !",
    ["get_not_allowed"] = "Ce stockage ne peut pas vous donner cet objet !",
    ["put_not_allowed"] = "Ce stockage ne peut pas accepter votre objet !",
    ["invalid_alreadyhaveone"] = "Vous avez déjà un tel object sur vous !",
    ["remove_failed"] = "L'objet n'a pas été trouvé !",
    ["invalid_weight"] = "Vos poches sont pleines...",
}

Config.crateMaxWeight = 12000

Config.zkeaCrateItemWeight = 2000

Config.crateTypeAllowed = {"food", "liquor", "drink", "cocktail"}

Config.Storages = {}

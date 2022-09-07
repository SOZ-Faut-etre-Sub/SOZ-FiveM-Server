local function getTargetOption(storage, itemId)
    return {
        color = "baun",
        type = "client",
        label = "Restocker",
        icon = "c:jobs/demonter.png",
        event = "soz-jobs:client:baun:restock",
        item = itemId,
        storage = storage,
        blackoutGlobal = true,
        blackoutJob = "baun",
        job = "baun",
        canInteract = function()
            return PlayerData.job.onduty
        end,
    }
end

local function getCocktailTargetOption()
    return {
        color = "baun",
        label = "Créer un cocktail box",
        icon = "c:baun/createCocktailBox.png",
        type = "client",
        event = "soz-jobs:client:baun:createCocktailBox",
        blackoutGlobal = true,
        blackoutJob = "baun",
        job = "baun",
        canInteract = function()
            local numberOfCocktails = 0
            for _, item in pairs(PlayerData.items) do
                if item.type == "cocktail" then
                    numberOfCocktails = numberOfCocktails + item.amount
                end
            end
            return PlayerData.job.onduty and numberOfCocktails >= 10
        end,
    }
end

Config.Storages["baun_boss_storage"] = {
    label = "Stockage Patron Bahama Unicorn",
    type = "boss_storage",
    owner = "baun",
    position = vector3(92.05, -1291.21, 29.27),
    size = vec2(0.7, 0.8),
    heading = 300,
    minZ = 28.27,
    maxZ = 29.87,
}

Config.Storages["baun_bahama_storage"] = {
    label = "Stockage Bahama Mamas",
    type = "storage",
    owner = "baun",
    position = vector3(-1385.06, -633.24, 30.81),
    size = vec2(0.8, 2.8),
    heading = 33,
    minZ = 29.81,
    maxZ = 32.61,
    targetOption = getCocktailTargetOption(),
}

Config.Storages["baun_unicorn_storage"] = {
    label = "Stockage Vanilla Unicorn",
    type = "storage",
    owner = "baun",
    position = vector3(92.87, -1290.87, 29.27),
    size = vec2(0.9, 0.8),
    heading = 300,
    minZ = 28.27,
    maxZ = 30.22,
    targetOption = getCocktailTargetOption(),
}

Config.Storages["baun_unicorn_liquor_storage_1"] = {
    label = "Frigo - Vanilla Unicorn",
    type = "liquor_storage",
    owner = "baun",
    position = vector3(132.34, -1285.02, 29.27),
    size = vec2(3.6, 0.6),
    minZ = 28.27,
    maxZ = 29.27,
    heading = 30,
    targetOption = getTargetOption("baun_unicorn_liquor_storage_1", "liquor_crate"),
}

Config.Storages["baun_unicorn_liquor_storage_2"] = {
    label = "Frigo - Vanilla Unicorn",
    type = "liquor_storage",
    owner = "baun",
    position = vector3(129.87, -1280.56, 29.27),
    size = vec2(2.8, 0.8),
    minZ = 28.27,
    maxZ = 29.27,
    heading = 30,
    targetOption = getTargetOption("baun_unicorn_liquor_storage_2", "liquor_crate"),
}

Config.Storages["baun_unicorn_flavor_storage_1"] = {
    label = "Coffre à saveurs - Vanilla Unicorn",
    type = "flavor_storage",
    owner = "baun",
    position = vector3(133.31, -1286.06, 29.27),
    size = vec2(0.7, 0.7),
    minZ = 29.27,
    maxZ = 30.17,
    heading = 30,
    targetOption = getTargetOption("baun_unicorn_flavor_storage_1", "flavor_crate"),
}

Config.Storages["baun_unicorn_furniture_storage_1"] = {
    label = "Coffre à fournitures - Vanilla Unicorn",
    type = "furniture_storage",
    owner = "baun",
    position = vector3(128.97, -1284.42, 29.27),
    size = vec2(0.5, 0.35),
    minZ = 29.27,
    maxZ = 29.67,
    heading = 30,
    targetOption = getTargetOption("baun_unicorn_furniture_storage_1", "furniture_crate"),
}

Config.Storages["baun_bahama_fridge_storage_1"] = {
    label = "Frigo - Bahama Mamas",
    type = "liquor_storage",
    owner = "baun",
    position = vector3(-1375.53, -629.32, 30.82),
    size = vec2(6.8, 0.2),
    minZ = 29.82,
    maxZ = 30.77,
    heading = 303,
    targetOption = getTargetOption("baun_bahama_fridge_storage_1", "liquor_crate"),
}

Config.Storages["baun_bahama_fridge_storage_2"] = {
    label = "Frigo - Bahama Mamas",
    type = "liquor_storage",
    owner = "baun",
    position = vector3(-1391.59, -606.41, 30.32),
    size = vec2(2.7, 0.3),
    minZ = 29.32,
    maxZ = 30.32,
    heading = 32,
    targetOption = getTargetOption("baun_bahama_fridge_storage_2", "liquor_crate"),
}

Config.Storages["baun_bahama_flavor_storage_1"] = {
    label = "Coffre à saveurs - Bahama Mamas",
    type = "flavor_storage",
    owner = "baun",
    position = vector3(-1389.55, -599.86, 30.32),
    size = vec2(0.75, 0.7),
    minZ = 30.32,
    maxZ = 31.12,
    heading = 302,
    targetOption = getTargetOption("baun_bahama_flavor_storage_1", "flavor_crate"),
}

Config.Storages["baun_bahama_flavor_storage_2"] = {
    label = "Coffre à saveurs - Bahama Mamas",
    type = "flavor_storage",
    owner = "baun",
    position = vector3(-1378.66, -631.6, 30.82),
    size = vec2(0.65, 0.6),
    minZ = 30.82,
    maxZ = 31.62,
    heading = 34,
    targetOption = getTargetOption("baun_bahama_flavor_storage_2", "flavor_crate"),
}

Config.Storages["baun_bahama_furniture_storage_1"] = {
    label = "Coffre à fournitures - Bahama Mamas",
    type = "furniture_storage",
    owner = "baun",
    position = vector3(-1389.54, -606.59, 30.38),
    size = vec2(0.55, 0.35),
    minZ = 30.33,
    maxZ = 30.73,
    heading = 38,
    targetOption = getTargetOption("baun_bahama_furniture_storage_1", "furniture_crate"),
}

Config.Storages["baun_bahama_furniture_storage_2"] = {
    label = "Coffre à fournitures - Bahama Mamas",
    type = "furniture_storage",
    owner = "baun",
    position = vector3(-1375.82, -627.51, 30.82),
    size = vec2(0.55, 0.3),
    minZ = 30.77,
    maxZ = 31.17,
    heading = 301,
    targetOption = getTargetOption("baun_bahama_furniture_storage_2", "furniture_crate"),
}

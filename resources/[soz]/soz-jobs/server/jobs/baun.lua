QBCore.Functions.CreateCallback("soz-jobs:server:baun:craft", function(source, cb, itemId)
    local player = QBCore.Functions.GetPlayer(source)
    if player == nil then
        cb(false, "Le joueur n'existe pas.")
        return
    end

    local cocktail = QBCore.Shared.Items[itemId]
    if cocktail == nil then
        cb(false, "Le cocktail n'existe pas.")
        return
    end

    local ingredients = BaunConfig.Recipes[itemId]
    for _, ingredient in pairs(ingredients) do
        local ingredientItem = QBCore.Shared.Items[ingredient.itemId]
        if ingredientItem == nil then
            cb(false, "Un des ingrédients n'existe pas.")
            return
        end
        local item = exports["soz-inventory"]:GetItem(source, ingredient.itemId, nil)
        if item.amount < ingredient.quantity or exports["soz-utils"]:ItemIsExpired(item) then
            cb(false, "missing_ingredient")
            return
        end
    end

    exports["soz-inventory"]:AddItem(source, itemId, 1, nil, nil, function(success, reason)
        if not success then
            local message = "Vos poches sont pleines..."
            if reason ~= "invalid_weight" then
                message = string.format("Il y a eu une erreur : `%s`", reason)
            end
            TriggerClientEvent("hud:client:DrawNotification", source, message, "error")
            cb(false)
            return
        else
            for _, ingredient in pairs(ingredients) do
                player.Functions.RemoveItem(ingredient.itemId, ingredient.quantity)
            end
            cb(true)
        end
    end)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:baun:can-harvest", function (source, cb, item)
    local canHarvest = exports['soz-inventory']:CanCarryItem(source, item, 1)
    cb(canHarvest)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:baun:harvest", function(source, cb, itemId)
    local player = QBCore.Functions.GetPlayer(source)
    if player == nil then
        cb(false, "Le joueur n'existe pas.")
        return
    end

    exports["soz-inventory"]:AddItem(source, itemId, 1, nil, nil, function(success, reason)
        cb(success, reason)
    end)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:baun:can-restock", function (source, cb, itemId)
    local canRestock = exports["soz-inventory"]:GetItem(source, itemId, nil, true) > 0
    cb(canRestock)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:baun:restock", function(source, cb, storage, itemId)
    local cbCalled = false
    local player = QBCore.Functions.GetPlayer(source)
    if player == nil then
        cbCalled = true
        cb(false, "Le joueur n'existe pas.")
        return
    end

    if not cbCalled and exports["soz-inventory"]:GetItem(source, itemId, nil, true) == 0 then
        cbCalled = true
        cb(false, "missing_ingredient")
        return
    end

    for _, item in pairs(BaunConfig.Restock[itemId]) do
        if not cbCalled then
            exports["soz-inventory"]:AddItem(storage, item.itemId, item.quantity, nil, nil, function(success, reason)
                if not success and not cbCalled then
                    print("Cannot add item: " .. json.encode(reason))
                    cbCalled = true
                    cb(success, reason)
                end
            end)
        end
    end

    if not cbCalled then
        player.Functions.RemoveItem(itemId, 1)
        cb(true, nil)
    end
end)

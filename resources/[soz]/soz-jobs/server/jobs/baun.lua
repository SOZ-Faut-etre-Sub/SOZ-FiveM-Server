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
                if not player.Functions.RemoveItem(ingredient.itemId, ingredient.quantity) then
                    cb(false, "missing_ingredient")
                    return
                end
            end
            cb(true)
        end
    end)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:baun:can-harvest", function(source, cb, item)
    if exports["soz-inventory"]:CanCarryItem(source, item, 1) then
        cb(true, nil)
    else
        cb(false, "Vos poches sont pleines.");
    end
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

QBCore.Functions.CreateCallback("soz-jobs:server:baun:can-restock", function(source, cb, itemId)
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

QBCore.Functions.CreateCallback("soz-jobs:server:baun:createCocktailBox", function(source, cb)
    local numberOfCocktails = 0
    local player = QBCore.Functions.GetPlayer(source)
    for _, item in pairs(player.PlayerData.items) do
        if item.type == "cocktail" then
            numberOfCocktails = numberOfCocktails + item.amount
        end
    end
    if numberOfCocktails < 10 then
        TriggerClientEvent("hud:client:DrawNotification", source, "Vous devez avoir au moins 10 cocktails pour créer une caisse.", "error")
        cb(false)
        return
    end
    local cocktailsToRemove = 10
    for _, item in pairs(player.PlayerData.items) do
        if item.type == "cocktail" then
            local amount = item.amount > cocktailsToRemove and cocktailsToRemove or item.amount
            exports["soz-inventory"]:RemoveItem(source, item.name, amount)
            cocktailsToRemove = cocktailsToRemove - amount
            if cocktailsToRemove == 0 then
                break
            end
        end
    end
    exports["soz-inventory"]:AddItem(source, "cocktail_box", 1, nil, nil, function(success, reason)
        if not success then
            TriggerClientEvent("hud:client:DrawNotification", source, "Vos poches sont pleines...", "error")
        else
            TriggerClientEvent("hud:client:DrawNotification", source, "Vous avez créé une cocktail box", "success")
        end
        cb(success)
    end)
end)

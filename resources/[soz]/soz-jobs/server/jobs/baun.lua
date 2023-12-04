QBCore.Functions.CreateCallback("soz-jobs:server:baun:can-craft", function(source, cb, itemId)
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
        if item.amount < ingredient.quantity or exports["soz-core"]:ItemIsExpired(item) then
            cb(false, "Vous n'avez pas assez de " .. ingredientItem.label .. ".")
            return
        end
    end
    cb(true, nil)
end)

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
        if item.amount < ingredient.quantity or exports["soz-core"]:ItemIsExpired(item) then
            cb(false, "missing_ingredient")
            return
        end
    end

    exports["soz-inventory"]:AddItem(source, source, itemId, 1, nil, nil, function(success, reason)
        if not success then
            local message = "Vos poches sont pleines..."
            if reason ~= "invalid_weight" then
                message = string.format("Il y a eu une erreur : `%s`", reason)
            end
            TriggerClientEvent("soz-core:client:notification:draw", source, message, "error")
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

    exports["soz-inventory"]:AddItem(source, source, itemId, 1, nil, nil, function(success, reason)
        cb(success, reason)
    end)

    exports["soz-core"]:Event("job_baun_harvest", {player_source = player.PlayerData.source, itemId = itemId}, {
        position = position,
        amount = 1,
    })
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
            exports["soz-inventory"]:AddItem(source, storage, item.itemId, item.quantity, nil, nil, function(success, reason)
                if not success and not cbCalled then
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
    local player = QBCore.Functions.GetPlayer(source)
    local playerCocktails = {}
    local cocktailsToRemove = 10
    for _, item in pairs(player.PlayerData.items) do
        if item.type == "cocktail" and item.amount > 0 and not exports["soz-core"]:ItemIsExpired(item) then
            local amount = item.amount > cocktailsToRemove and cocktailsToRemove or item.amount
            cocktailsToRemove = cocktailsToRemove - amount

            local tempItem = item
            tempItem.amount = amount

            table.insert(playerCocktails, tempItem)

            if cocktailsToRemove == 0 then
                break
            end
        end
    end
    if cocktailsToRemove ~= 0 then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Vous devez avoir au moins 10 cocktails pour créer une caisse.", "error")
        cb(false)
        return
    end

    local checkList = {}
    table.insert(checkList, {name = "cocktail_box", amount = 1})

    for _, item in pairs(playerCocktails) do
        table.insert(checkList, {name = item.name, amount = -item.amount})
    end

    if not exports["soz-inventory"]:CanCarryItems(source, checkList) then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Vos poches sont pleines.", "error")
        cb(false)
        return
    end

    for _, item in pairs(playerCocktails) do
        player.Functions.RemoveItem(item.name, item.amount, item.slot)
    end

    exports["soz-inventory"]:AddItem(source, source, "cocktail_box", 1, nil, nil, function(success, reason)
        if not success then
            TriggerClientEvent("soz-core:client:notification:draw", source, "Vos poches sont pleines...", "error")
        else
            TriggerClientEvent("soz-core:client:notification:draw", source, "Vous avez créé un assortiment de cocktails.", "success")
        end
        cb(success)
    end)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:baun:createIceCubes", function(source, cb)
    local player = QBCore.Functions.GetPlayer(source)
    local bottleToRemove = 1
    local itemToRemove = "water_bottle"
    for _, item in pairs(player.PlayerData.items) do
        if item.name == itemToRemove and item.amount > 0 and not exports["soz-core"]:ItemIsExpired(item) then
            local amount = item.amount > bottleToRemove and bottleToRemove or item.amount
            bottleToRemove = bottleToRemove - amount

            if bottleToRemove == 0 then
                break
            end
        end
    end

    if bottleToRemove ~= 0 then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Vous devez avoir au moins 1 bouteille d'eau pour créer des glaçons.", "error")
        cb(false)
        return
    end

    if not exports["soz-inventory"]:CanCarryItem(source, "ice_cube", 6) then
        TriggerClientEvent("soz-core:client:notification:draw", source, "Vos poches sont pleines.", "error")
        cb(false)
        return
    end

    player.Functions.RemoveItem(itemToRemove, 1)

    exports["soz-inventory"]:AddItem(source, source, "ice_cube", 6, nil, nil, function(success, reason)
        if not success then
            TriggerClientEvent("soz-core:client:notification:draw", source, "Vos poches sont pleines...", "error")
        else
            TriggerClientEvent("soz-core:client:notification:draw", source, "Vous avez fait 6 glaçons.", "success")
        end
        cb(success)
    end)
end)

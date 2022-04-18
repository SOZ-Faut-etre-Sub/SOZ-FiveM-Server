local function AddItem(source, item)
    local receivedItem = false
    exports["soz-inventory"]:AddItem(source, item, 1, nil, nil, function(success, reason)
        if success then
            receivedItem = true
        else
            if reason == "invalid_weight" then
                TriggerClientEvent("hud:client:DrawNotification", source, "Vos poches sont pleines...", "error")
            else
                TriggerClientEvent("hud:client:DrawNotification", source,
                                   string.format("Vous n'avez pas collecté d'ingrédients'. Il y a eu une erreur : `%s`", reason), "error")
            end
        end
    end)
    return receivedItem
end

QBCore.Functions.CreateCallback("soz-jobs:server:food-collect-ingredients", function(source, cb, fieldName)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    local field = Fields[fieldName]
    if field == nil then
        TriggerClientEvent("hud:client:DrawNotification", source, "Il y a eu une erreur: invalid_field", "error")
    end

    local quantity, newHealth = field:Harvest()
    print("QUANT", quantity, newHealth)

    local items = {}
    for i = 1, quantity, 1 do
        local itemIdx = math.random(#FoodConfig.Collect.Items)
        table.insert(items, FoodConfig.Collect.Items[itemIdx])
    end

    local collectedItems = {}
    for _, item in ipairs(items) do
        if AddItem(Player.PlayerData.source, item) then
            if collectedItems[item] == nil then
                collectedItems[item] = 1
            else
                collectedItems[item] = collectedItems[item] + 1
            end
        else
            cb(collectedItems, newHealth)
            return
        end
    end

    cb(collectedItems, newHealth)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:food-craft", function(source, cb, itemId)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    local item = QBCore.Shared.Items[itemId]
    if item == nil then
        cb(false, "invalid_item")
    end

    local recipe = FoodConfig.Recipes[itemId]
    if recipe == nil then
        cb(false, "invalid_recipe")
    end

    local ingredients = recipe.ingredients
    for ingId, count in pairs(ingredients) do
        local ingredient = QBCore.Shared.Items[ingId]
        if ingredient == nil then
            cb(false, "invalid_ingredient_item")
        end
        if exports["soz-inventory"]:GetItem(source, ingId, nil, true) < count then
            cb(false, "invalid_ingredient")
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
        else
            for ingId, count in pairs(ingredients) do
                Player.Functions.RemoveItem(ingId, count)
            end
            cb(true)
        end
    end)
end)

QBCore.Functions.CreateCallback("soz-jobs:server:bahamas:craft-item", function(source, cb, itemId)
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

    local ingredients = BahamasConfig.Recipes[itemId]
    for _, ingredient in pairs(ingredients) do
        local ingredientItem = QBCore.Shared.Items[ingredient.itemId]
        if ingredientItem == nil then
            cb(false, "Un des ingrédients n'existe pas.")
            return
        end
        local item = exports["soz-inventory"]:GetItem(source, ingredient.itemId, nil)
        if item.amount < ingredient.quantity or exports["soz-utils"]:ItemIsExpired(item) then
            cb(false, "Il manque un ingrédient.")
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

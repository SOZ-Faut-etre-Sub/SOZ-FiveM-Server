local Fields = {}

-- Create Fields
for name, _ in pairs(FoodConfig.Zones) do
    local fieldType = string.match(name, "%a+")
    local data = FoodConfig.Fields[fieldType]

    Fields[name] = Field:new(name, data.item, data.prodRange.min, data.prodRange, data.refillDelay, data.harvestRange)
    Fields[name]:StartRefillLoop(FoodConfig.RefillLoopDelay)
end

QBCore.Functions.CreateCallback("soz-jobs:server:food:getFieldHealth", function(source, cb, fieldName)
    local field = Fields[fieldName]
    if field ~= nil then
        cb(field:GetHealthState())
    end
    cb(nil)
end)

local function AddItem(source, item, itemCount)
    local count = 1
    if itemCount then
        count = itemCount
    end

    local receivedItem = false
    exports["soz-inventory"]:AddItem(source, source, item, count, nil, nil, function(success, reason)
        if success then
            receivedItem = true
        else
            if reason == "invalid_weight" then
                TriggerClientEvent("soz-core:client:notification:draw", source, "Vos poches sont pleines...", "error")
            else
                TriggerClientEvent("soz-core:client:notification:draw", source,
                                   string.format("Vous n'avez pas récolté d'ingrédients'. Il y a eu une erreur : `%s`", reason), "error")
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
        TriggerClientEvent("soz-core:client:notification:draw", source, "Il y a eu une erreur: invalid_field", "error")
    end

    local quantity, item, newHealth = field:Harvest()

    local items = {}
    for i = 1, quantity, 1 do
        table.insert(items, item)
    end

    local collectedItems = {}
    for _, item in pairs(items) do
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

QBCore.Functions.CreateCallback("soz-jobs:server:food-collect-milk", function(source, cb, hour)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    local reward = FoodConfig.Collect.Milk.Reward
    local min, max = reward.min, reward.max

    -- Production is boosted on LOW pollution level
    local pollutionLevel = exports["soz-upw"]:GetPollutionLevel()
    if pollutionLevel == QBCore.Shared.Pollution.Level.Low then
        min = min + 1
        max = max + 1
    end

    local count = math.random(min, max)

    local index = math.floor(hour / (24 / #FoodConfig.Collect.Milk.Items))
    local item = FoodConfig.Collect.Milk.Items[index + 1]

    if AddItem(Player.PlayerData.source, item, count) then
        cb(true, count, item)
    else
        cb(false)
    end
end)

QBCore.Functions.CreateCallback("soz-jobs:server:food-craft", function(source, cb, itemId)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    local item = QBCore.Shared.Items[itemId]
    if item == nil then
        cb(false, "invalid_item")
        return
    end

    local recipe = FoodConfig.Recipes[itemId]
    if recipe == nil then
        cb(false, "invalid_recipe")
        return
    end

    local ingredients = recipe.ingredients
    for ingId, count in pairs(ingredients) do
        local ingredient = QBCore.Shared.Items[ingId]
        if ingredient == nil then
            cb(false, "invalid_ingredient_item")
            return
        end
        local ingItem = exports["soz-inventory"]:GetItem(source, ingId, nil)
        if ingItem.amount < count or exports["soz-core"]:ItemIsExpired(ingItem) then
            cb(false, "invalid_ingredient")
            return
        end
    end

    exports["soz-inventory"]:AddItem(source, source, itemId, recipe.output or 1, nil, nil, function(success, reason)
        if not success then
            local message = "Vos poches sont pleines..."
            if reason ~= "invalid_weight" then
                message = string.format("Il y a eu une erreur : `%s`", reason)
            end
            TriggerClientEvent("soz-core:client:notification:draw", source, message, "error")
            cb(false)
            return
        else
            for ingId, count in pairs(ingredients) do
                Player.Functions.RemoveItem(ingId, count)
            end
            cb(true)
        end
    end)
end)

--- Hunting
RegisterNetEvent("jobs:server:food:hunting", function(huntId)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    local rewardSuccess = false
    local position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))

    if not DoesEntityExist(NetworkGetEntityFromNetworkId(huntId)) then
        return
    end

    for item, reward in pairs(FoodConfig.HuntingReward) do
        local amount = math.random(reward.min, reward.max)

        exports["soz-inventory"]:AddItem(Player.PlayerData.source, Player.PlayerData.source, item, amount, nil, nil, function(success, reason)
            if success then
                exports["soz-core"]:Event("job_cm_food_hunting",
                                          {
                    item_id = item,
                    player_source = Player.PlayerData.source,
                    on_duty = Player.PlayerData.job.onduty,
                }, {item_label = item.label, quantity = amount, position = position})

                rewardSuccess = true
            end
        end)
    end

    if rewardSuccess then
        DeleteEntity(NetworkGetEntityFromNetworkId(huntId))
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous avez ~r~terminé~s~ de dépecer.")
    else
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vos poches sont pleines...", "error")
    end
end)

QBCore.Functions.CreateUseableItem("meal_box", function(source, item)
    if exports["soz-inventory"]:CanCarryItems(source, {
        {name = "meal_box", amount = -1},
        {name = "vegan_meal", amount = 5},
        {name = "onigiri_assortment", amount = 5},
        {name = "meat_festival", amount = 5},
        {name = "royal_vegetables", amount = 5},
    }) then
        exports["soz-inventory"]:RemoveItem(source, "meal_box", 1, item.metadata, item.slot)
        exports["soz-inventory"]:AddItem(source, source, "vegan_meal", 5, item.metadata)
        exports["soz-inventory"]:AddItem(source, source, "onigiri_assortment", 5, item.metadata)
        exports["soz-inventory"]:AddItem(source, source, "meat_festival", 5, item.metadata)
        exports["soz-inventory"]:AddItem(source, source, "royal_vegetables", 5, item.metadata)
    else
        TriggerClientEvent("soz-core:client:notification:draw", source, "Vos poches sont trop pleines pour ouvrir la caisse.", "error")
    end
end)

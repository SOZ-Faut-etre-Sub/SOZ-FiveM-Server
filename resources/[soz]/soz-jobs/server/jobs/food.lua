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

QBCore.Functions.CreateCallback("soz-jobs:server:food-collect-ingredients", function(source, cb, count)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local items = {}
    for i = 1, count, 1 do
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
            cb(collectedItems)
            return
        end
    end

    cb(collectedItems)
end)

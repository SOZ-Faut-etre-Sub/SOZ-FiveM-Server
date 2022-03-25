local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-jobs:server:stonk-collect-bag", function(shopId)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local range = StonkConfig.Collection.Range
    local nBags = math.random(range.min, range.max)

    exports["soz-inventory"]:AddItem(Player.PlayerData.source, StonkConfig.BagItem, nBags, nil, nil, function(success, reason)
        if not success then
            TriggerClientEvent("hud:client:DrawNotification", source,
                               string.format("~r~Vous n'avez pas collecté de sacs d'argent. Il y a eu une erreur : `%s`", reason))
            return
        end

        TriggerClientEvent("hud:client:DrawNotification", source, string.format("~g~Vous avez collecté %d sacs d'argent", nBags))
        TriggerClientEvent("soz-jobs:client:stonk-save-bag-collection", source, shopId)
    end)
end)

RegisterNetEvent("soz-jobs:server:stonk-resale-bag", function()
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local nItems = exports["soz-inventory"]:GetItem(Player.PlayerData.source, StonkConfig.Collection.BagItem, nil, true)
    print("nItems", tonumber(nItems))

    if nItems <= 0 then
        TriggerClientEvent("hud:client:DrawNotification", source, "~r~Vous n'avez pas de sacs d'argent.")
        return
    end

    Player.Functions.RemoveItem(StonkConfig.Collection.BagItem, 1, nil)
    TriggerClientEvent("hud:client:DrawNotification", source, "~g~Vous avez deposez 1 sac d'argent.", false, 2000)

    -- TODO: Add money to bank account
end)

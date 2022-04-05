local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-jobs:server:stonk-collect-bag", function(nBags)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    -- TODO CHECK IVENTORY SPACE
    exports["soz-inventory"]:AddItem(Player.PlayerData.source, StonkConfig.Collection.BagItem, nBags, nil, nil, function(success, reason)
        if not success then
            TriggerClientEvent("hud:client:DrawNotification", source,
                               string.format("Vous n'avez pas collecté de sacs d'argent. Il y a eu une erreur : `%s`", reason), "error")
            return
        end
    end)
end)

RegisterNetEvent("soz-jobs:server:stonk-resale-bag", function(nBags)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local nItems = exports["soz-inventory"]:GetItem(Player.PlayerData.source, StonkConfig.Collection.BagItem, nil, true)

    if nItems < nBags then
        TriggerClientEvent("hud:client:DrawNotification", source, "Vous n'avez pas suffisamment de sacs d'argent.", "error")
        return
    end

    Player.Functions.RemoveItem(StonkConfig.Collection.BagItem, nBags, nil)

    TriggerEvent("banking:server:TransfertMoney", StonkConfig.Accounts.FarmAccount, StonkConfig.Accounts.SafeStorage, StonkConfig.Resale.Price)
end)

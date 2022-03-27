local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-jobs:server:stonk-collect-bag", function()
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    exports["soz-inventory"]:AddItem(Player.PlayerData.source, StonkConfig.Collection.BagItem, 1, nil, nil, function(success, reason)
        if not success then
            TriggerClientEvent("hud:client:DrawNotification", source,
                               string.format("~r~Vous n'avez pas collecté de sacs d'argent. Il y a eu une erreur : `%s`", reason))
            return
        end
    end)
end)

RegisterNetEvent("soz-jobs:server:stonk-resale-bag", function()
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local nItems = exports["soz-inventory"]:GetItem(Player.PlayerData.source, StonkConfig.Collection.BagItem, nil, true)

    if nItems <= 0 then
        TriggerClientEvent("hud:client:DrawNotification", source, "~r~Vous n'avez pas de sacs d'argent.")
        return
    end

    Player.Functions.RemoveItem(StonkConfig.Collection.BagItem, 1, nil)

    TriggerEvent("banking:server:SafeStorageAddMoney", StonkConfig.SafeStorageName, "money", StonkConfig.Resale.Price)
end)

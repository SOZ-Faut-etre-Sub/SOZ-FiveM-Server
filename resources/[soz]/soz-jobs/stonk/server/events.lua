local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-jobs:server:stonk-collect-bag", function (shopId)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local range = StonkConfig.CollectionRange
    local nBags = math.random(range.min, range.max)

    exports["soz-inventory"]:AddItem(Player.PlayerData.source, StonkConfig.BagItem, nBags, nil, nil, function (success, reason)
        if not success then
            TriggerClientEvent("hud:client:DrawNotification", source, string.format("~r~Vous n'avez pas collecté de sacs d'argent. Il y a eu une erreur : `%s`", reason))
            return
        end

        TriggerClientEvent("hud:client:DrawNotification", source, string.format("~g~Vous avez collecté %d sacs d'argent", nBags))
        TriggerClientEvent("soz-jobs:client:stonk-save-bag-collection", source, shopId)
    end)
end)

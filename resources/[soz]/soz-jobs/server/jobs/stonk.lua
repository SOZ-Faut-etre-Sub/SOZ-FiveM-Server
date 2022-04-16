local function AddItem(source, count)
    local receivedItems = false
    exports["soz-inventory"]:AddItem(source, StonkConfig.Collection.BagItem, count, nil, nil, function(success, reason)
        if not success then
            if reason == "invalid_weight" then
                if count > 1 then
                    receivedItems = AddItem(source, count - 1)
                else
                    TriggerClientEvent("hud:client:DrawNotification", source, "Vos poches sont pleines...", "error")
                end
            else
                TriggerClientEvent("hud:client:DrawNotification", source,
                                   string.format("Vous n'avez pas collecté de sacs d'argent. Il y a eu une erreur : `%s`", reason), "error")
            end
        else
            TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous avez collecté ~g~%d sacs d'argent", count))
            receivedItems = true
        end
    end)
    return receivedItems
end

QBCore.Functions.CreateCallback("soz-jobs:server:stonk-collect-bag", function(source, cb, nBags)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end
    local success = AddItem(Player.PlayerData.source, nBags)
    cb(success)
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

-- FILL IN
QBCore.Functions.CreateCallback("soz-jobs:server:stonk-fill-in", function(source, cb, data)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        cb(false, "invalid_player")
    end

    local itemCount = exports["soz-inventory"]:GetItem(Player.PlayerData.source, StonkConfig.Collection.BagItem, nil, true)
    if itemCount < 1 then
        cb(false, "invalid_quantity")
    end

    local p = promise.new()
    QBCore.Functions.TriggerCallback("banking:server:needRefill", source, function(result)
        p:resolve(result)
    end, data)
    local needRefill = Citizen.Await(p)
    if not needRefill then
        cb(false, "invalid_money")
    end

    -- TODO
    --  - RemoveItem
    --  - TransferMoney
end)

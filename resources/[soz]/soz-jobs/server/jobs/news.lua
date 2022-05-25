--- Items
QBCore.Functions.CreateUseableItem("newspaper", function(source, item)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player.PlayerData.job.id ~= SozJobCore.JobType.News then
        return
    end

    TriggerClientEvent("jobs:client:news:SellNewspaper", source)
end)

QBCore.Functions.CreateUseableItem("n_camera", function(source, item)
    TriggerClientEvent("jobs:utils:camera:toggle", source)
end)

QBCore.Functions.CreateUseableItem("n_mic", function(source, item)
    TriggerClientEvent("jobs:utils:mic:toggle", source)
end)

QBCore.Functions.CreateUseableItem("n_bmic", function(source, item)
    TriggerClientEvent("jobs:utils:bmic:toggle", source)
end)

--- Events
RegisterNetEvent("jobs:server:news:newspaperSold", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local newspaperAmount = math.random(NewsConfig.SellAmount.min, NewsConfig.SellAmount.max)

    local playerNewspaper = exports["soz-inventory"]:GetItem(Player.PlayerData.source, "newspaper", nil, true)

    if playerNewspaper < 1 then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ~r~n'avez plus~s~ de journaux", "error")

        return
    end

    if newspaperAmount > playerNewspaper then
        newspaperAmount = playerNewspaper
    end

    TriggerEvent("banking:server:TransferMoney", "farm_news", "safe_news", newspaperAmount * NewsConfig.SellPrice)
    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "newspaper", newspaperAmount)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez vendu ~g~" .. newspaperAmount .. " journaux")

    TriggerEvent("monitor:server:event", "job_news_sell_newspaper", {player_source = Player.PlayerData.source},
                 {
        quantity = tonumber(newspaperAmount),
        position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
    })
end)

RegisterNetEvent("jobs:server:news:newspaperFarm", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local newspaperAmount = math.random(NewsConfig.SellAmount.min * NewsConfig.FarmMultiplier, NewsConfig.SellAmount.max * NewsConfig.FarmMultiplier)

    exports["soz-inventory"]:AddItem(Player.PlayerData.source, "newspaper", newspaperAmount, nil, nil, function(success)
        if success then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez récupéré ~g~" .. newspaperAmount .. " journaux")
        end
    end)

    TriggerEvent("monitor:server:event", "job_news_print_newspaper", {player_source = Player.PlayerData.source},
                 {
        quantity = tonumber(newspaperAmount),
        position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
    })
end)

RegisterNetEvent("jobs:server:news:UseMobileItem", function(item, event)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player.PlayerData.job.id ~= SozJobCore.JobType.News then
        return
    end

    if (exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true) or 0) >= 1 then
        TriggerClientEvent(event, Player.PlayerData.source)
    end
end)

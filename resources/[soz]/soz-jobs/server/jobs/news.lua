--- Items
QBCore.Functions.CreateUseableItem("newspaper", function(source, item)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player.PlayerData.job.id ~= SozJobCore.JobType.News then
        return
    end

    TriggerClientEvent("jobs:client:news:SellNewspaper", source)
end)

--- Events
RegisterNetEvent("jobs:server:news:newspaperSold", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local newspaperAmount = math.random(NewsConfig.SellAmount.min, NewsConfig.SellAmount.max)

    local playerNewspaper = exports["soz-inventory"]:GetItem(Player.PlayerData.source, "newspaper", nil, true)

    if playerNewspaper < 1 then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ~r~n'avez plus~w~ de journaux", "error")

        return
    end

    if newspaperAmount > playerNewspaper then
        newspaperAmount = playerNewspaper
    end

    TriggerEvent("banking:server:TransfertMoney", "farm_news", "news", newspaperAmount * NewsConfig.SellPrice)
    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "newspaper", newspaperAmount)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez vendu ~g~" .. newspaperAmount .. " journaux")
end)

RegisterNetEvent("jobs:server:news:newspaperFarm", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local newspaperAmount = math.random(NewsConfig.SellAmount.min * NewsConfig.FarmMultiplier, NewsConfig.SellAmount.max * NewsConfig.FarmMultiplier)

    exports["soz-inventory"]:AddItem(Player.PlayerData.source, "newspaper", newspaperAmount)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez récupéré ~g~" .. newspaperAmount .. " journaux")
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

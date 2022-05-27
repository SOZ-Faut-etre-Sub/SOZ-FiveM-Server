QBCore = exports["qb-core"]:GetCoreObject()

--- item

QBCore.Functions.CreateUseableItem("tissue", function(source)
    local player = QBCore.Functions.GetPlayer(source)

    if player.PlayerData.metadata["disease"] == "rhume" then
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous utilisez un mouchoir et vous vous sentez mieux !"))
        TriggerEvent("lsmc:maladie:server:SetCurrentDisease", false, source)
    else
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous utilisez un mouchoir, mais rien ne sort !"))
    end

    exports["soz-inventory"]:RemoveItem(source, "tissue", 1, nil)
end)

QBCore.Functions.CreateUseableItem("antibiotic", function(source)
    local player = QBCore.Functions.GetPlayer(source)

    if player.PlayerData.metadata["disease"] == "intoxication" then
        TriggerEvent("lsmc:maladie:server:SetCurrentDisease", false, source)
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous utilisez un antibiotique et vous vous sentez mieux !"))
    else
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous utilisez un antibiotique, mais rien ne change !"))
    end

    exports["soz-inventory"]:RemoveItem(source, "antibiotic", 1, nil)
end)

QBCore.Functions.CreateUseableItem("pommade", function(source)
    TriggerClientEvent("lsmc:client:pommade", source)
end)

QBCore.Functions.CreateUseableItem("ifaks", function(source)
    TriggerClientEvent("lsmc:client:ifaks", source)
end)

QBCore.Functions.CreateUseableItem("defibrillator", function(source)
    TriggerClientEvent("lsmc:client:défibrillateur", source)
end)

QBCore.Functions.CreateUseableItem("painkiller", function(source)
    local player = QBCore.Functions.GetPlayer(source)

    if player.PlayerData.metadata["disease"] == "backpain" then
        TriggerEvent("lsmc:maladie:server:SetCurrentDisease", false, source)
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous utilisez un anti-douleur et vous vous sentez mieux !"))
    else
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous utilisez un anti-douleur, mais rien ne change !"))
    end

    exports["soz-inventory"]:RemoveItem(source, "painkiller", 1, nil)
end)

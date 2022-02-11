local QBCore = exports["qb-core"]:GetCoreObject()

RegisterServerEvent("job:set:unemployed", function()
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    TriggerClientEvent("QBCore:Notify", source, string.format("Vous êtes à nouveau sans emploie"))
    Player.Functions.SetJob("unemployed", 0)
end)

RegisterServerEvent("job:set:pole", function(job)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    TriggerClientEvent("QBCore:Notify", source, string.format("Vous commencer le travail: %s", job))
    Player.Functions.SetJob(job, 0)
end)

RegisterServerEvent("job:payout", function(money)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    Player.Functions.AddMoney("money", money)
    TriggerClientEvent("QBCore:Notify", source, string.format("Vous recevez: %s $ pour votre travail", money))
end)

RegisterServerEvent("job:payout:metal", function(money, source)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    Player.Functions.AddMoney("money", money)
    TriggerClientEvent("QBCore:Notify", source, string.format("Vous recevez: %s $ pour votre travail", money))
end)

RegisterServerEvent("job:anounce", function(string)
    TriggerClientEvent("QBCore:Notify", source, string.format(string))
end)

RegisterServerEvent("job:get:metal", function(amount)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    local metadata = {}
    exports['soz-inventory']:AddItem(Player.PlayerData.source, "metalscrap", amount, metadata, false)
    TriggerClientEvent("QBCore:Notify", source, string.format("Vous avez reçu %s metalscrap", amount))
end)

RegisterServerEvent("job:remove:metal", function(amount)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    local totalAmount = exports['soz-inventory']:GetItem(Player.PlayerData.source, "metalscrap", nil, true)
    if tonumber(amount) <= tonumber(totalAmount) then
        exports['soz-inventory']:RemoveItem(Player.PlayerData.source, "metalscrap", amount, nil)
        TriggerClientEvent("QBCore:Notify", source, string.format("Vous avez vendu %s metalscrap", amount))
        local payout = amount * Config.metal_payout
        TriggerEvent("job:payout:metal", payout, source)
    else
        TriggerClientEvent("QBCore:Notify", source, string.format("Vous essayer de vendre plus que se que vous possédez", amount))
    end
end)

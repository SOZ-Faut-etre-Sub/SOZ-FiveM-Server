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
    Player.Functions.AddMoney("cash", money)
    TriggerClientEvent("QBCore:Notify", source, string.format("Vous recevez: %s $ pour votre travail", money))
end)

RegisterServerEvent("job:anounce", function(string)
    TriggerClientEvent("QBCore:Notify", source, string.format(string))
end)

RegisterServerEvent("job:get:metal", function(amount)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    local metadata = {}
    exports['soz-inventory']:AddItem(Player.PlayerData.source, "metalscrap", amount, metadata, false)
    TriggerClientEvent("QBCore:Notify", source, string.format("Vous avez reçu ~o~%s metalscrap", amount))
end)
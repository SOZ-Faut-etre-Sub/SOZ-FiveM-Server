local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("taxi:server:NpcPay", function(Payment)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    Player.Functions.AddMoney("money", Payment)
    TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous recevez: %s $ pour votre mission", Payment))
end)

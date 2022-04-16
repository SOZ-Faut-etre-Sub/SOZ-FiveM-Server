QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-core:server:dispenser:pay")
AddEventHandler("soz-core:server:dispenser:pay", function(amount)
    local Player = QBCore.Functions.GetPlayer(source)
    Player.Functions.RemoveMoney("money", amount)
end)

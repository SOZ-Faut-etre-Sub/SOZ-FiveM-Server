RegisterNetEvent("qb-carwash:server:washCar", function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if Player.Functions.RemoveMoney("money", 50, "car-washed") then
        TriggerClientEvent("qb-carwash:client:washCar", src)
    else
        TriggerClientEvent("hud:client:DrawNotification", src, "Vous n'avez pas assez d'argent", "error")
    end
end)

local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("fuel:pay", function(price, source)
    local xPlayer = QBCore.Functions.GetPlayer(source)
    local amount = math.floor(price + 0.5)
    if price > 0 then
        xPlayer.Functions.RemoveMoney("money", amount)
    end
end)

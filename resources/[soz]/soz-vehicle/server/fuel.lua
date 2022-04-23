local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("fuel:pay", function(price, source)
    local xPlayer = QBCore.Functions.GetPlayer(source)
    local amount = math.floor(price + 0.5)
    if price > 0 then
        xPlayer.Functions.RemoveMoney("money", amount)
    end
end)

QBCore.Functions.CreateCallback("soz-fuel:server:getfuelstock", function(source, cb)
    local fuelstock = MySQL.Sync.fetchAll("SELECT * FROM fuel_storage")
    if fuelstock[1] then
        cb(fuelstock)
    end
end)

RegisterNetEvent("soz-fuel:server:setTempFuel", function(int)
    MySQL.Async.execute("UPDATE fuel_storage SET stock = stock - 100 WHERE station = ?", {int})
end)

RegisterNetEvent("soz-fuel:server:setFinalFuel", function(int, currentFuelAdd)
    MySQL.Async.execute("UPDATE fuel_storage SET stock = stock + ? WHERE station = ?", {currentFuelAdd, int})
end)

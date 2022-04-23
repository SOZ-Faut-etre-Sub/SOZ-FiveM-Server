local QBCore = exports["qb-core"]:GetCoreObject()
local stations = {}

RegisterNetEvent("fuel:pay", function(price, source)
    local xPlayer = QBCore.Functions.GetPlayer(source)
    local amount = math.floor(price + 0.5)
    if price > 0 then
        xPlayer.Functions.RemoveMoney("money", amount)
    end
end)

MySQL.ready(function()
    local data = MySQL.Sync.fetchAll("SELECT * FROM fuel_storage")

    for _, station in pairs(data) do
        table.insert(stations, {
            id = station.id,
            station = station.station,
            fuel = station.fuel,
            stock = station.stock,
            position = json.decode(station.position),
            model = station.model,
            zone = json.decode(station.zone),
        })
    end
end)

QBCore.Functions.CreateCallback("soz-fuel:server:getStations", function(source, cb)
    cb(stations)
end)

QBCore.Functions.CreateCallback("soz-fuel:server:getfuelstock", function(source, cb, id)
    local fuelstock = MySQL.Sync.fetchAll("SELECT * FROM fuel_storage WHERE id = @id", {["@id"] = id})

    if #fuelstock > 0 then
        cb(fuelstock[1].stock)
    else
        cb(0)
    end
end)

RegisterNetEvent("soz-fuel:server:setTempFuel", function(id)
    MySQL.Async.execute("UPDATE fuel_storage SET stock = stock - 100 WHERE id = ?", {id})
end)

RegisterNetEvent("soz-fuel:server:setFinalFuel", function(id, currentFuelAdd)
    MySQL.Async.execute("UPDATE fuel_storage SET stock = stock + ? WHERE id = ?", {currentFuelAdd, id})
end)

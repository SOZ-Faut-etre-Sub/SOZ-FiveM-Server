local QBCore = exports["qb-core"]:GetCoreObject()
local stations = {}
local playerFueling = {}

--- Functions
local function saveStation(id)
    MySQL.Async.execute("UPDATE fuel_storage SET stock = :stock WHERE id = :id", {
        ["id"] = id,
        ["stock"] = stations[id].stock,
    })
end

local function pay(price, source)
    local xPlayer = QBCore.Functions.GetPlayer(source)
    local amount = math.floor(price + 0.5)
    if price > 0 then
        xPlayer.Functions.RemoveMoney("money", amount)
    end
end

MySQL.ready(function()
    local data = MySQL.Sync.fetchAll("SELECT * FROM fuel_storage")

    for _, station in pairs(data) do
        stations[station.id] = {
            id = station.id,
            station = station.station,
            fuel = station.fuel,
            type = station.type,
            owner = station.owner,
            stock = station.stock,
            position = json.decode(station.position),
            model = station.model,
            zone = json.decode(station.zone),
        }

        if station.type == "private" then
            local stationCoord = stations[station.id].position

            exports["soz-utils"]:CreateObject(station.model, stationCoord.x, stationCoord.y, stationCoord.z, stationCoord.w, 8000.0, true)
        end
    end
end)

--- Callbacks
QBCore.Functions.CreateCallback("soz-fuel:server:getStations", function(source, cb)
    cb(stations)
end)

QBCore.Functions.CreateCallback("soz-fuel:server:getfuelstock", function(source, cb, id)
    cb(stations[id].stock or 0)
end)

--- Events
RegisterNetEvent("soz-fuel:server:getStationStock", function(cb, id)
    cb(stations[id].stock or 0)
end)

RegisterNetEvent("soz-fuel:server:addStationStock", function(id, amount)
    stations[id].stock = stations[id].stock + tonumber(amount)
    if stations[id].stock > 2000 then
        stations[id].stock = 2000
    end
    saveStation(id)
end)

RegisterNetEvent("soz-fuel:server:setTempFuel", function(id)
    stations[id].stock = stations[id].stock - 100
    if stations[id].stock < 0 then
        stations[id].stock = 0
    end
    saveStation(id)
end)

RegisterNetEvent("soz-fuel:server:setFinalFuel", function(id, currentFuelAdd)
    stations[id].stock = stations[id].stock + tonumber(currentFuelAdd)
    saveStation(id)
end)

RegisterNetEvent("soz-fuel:server:BeginFueling", function(currentFuel, playerId)
    playerFueling[playerId] = currentFuel
end)

RegisterNetEvent("soz-fuel:server:SetFuel", function(entity, newFuel, serverIDcar, stationType, playerId)
    TriggerClientEvent("soz-fuel:client:SetFuel", serverIDcar, entity, newFuel)

    if stationType ~= "private" then
        local price = ((newFuel - playerFueling[playerId]) / 100) * Config.RefillCost
        pay(tonumber(math.ceil(price)), playerId)
        playerFueling[playerId] = nil;
    end
end)

--- Items
QBCore.Functions.CreateUseableItem("essence_jerrycan", function(source, item)
    TriggerClientEvent("soz-fuel:client:onJerrycanEssence", source)
end)

RegisterNetEvent("soz-fuel:server:removeJerrycanEssence", function()
    local Player = QBCore.Functions.GetPlayer(source)
    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "essence_jerrycan", 1)
end)

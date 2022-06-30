local QBCore = exports["qb-core"]:GetCoreObject()
local StationsList = {}
local playerFueling = {}

--- Main
MySQL.ready(function()
    local stations = MySQL.Sync.fetchAll("SELECT * FROM fuel_storage")

    for _, station in pairs(stations) do
        StationsList[station.id] = FuelStation:new(
            station.id,
            station.station,
            station.fuel,
            station.type,
            station.owner,
            station.stock,
            station.position,
            station.model,
            station.zone
        )

        StationsList[station.id]:SpawnStation()
    end
end)

--- Functions
local function saveStation(id)
    MySQL.Async.execute("UPDATE fuel_storage SET stock = :stock WHERE id = :id", {
        ["id"] = id,
        ["stock"] = StationsList[id].stock,
    })
end

--- Callbacks
QBCore.Functions.CreateCallback("fuel:server:GetStations", function(source, cb)
    cb(StationsList)
end)

QBCore.Functions.CreateCallback("fuel:server:GetStation", function(source, cb, id)
    cb(StationsList[id])
end)

QBCore.Functions.CreateCallback("fuel:server:RequestRefuel", function(source, cb, id, maxRefueling)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        cb(false)
        return
    end

    local station = StationsList[id]
    if station == nil then
        cb(0)
        return
    end

    if not station:HasSufficientStock() then
        cb(0)
        return
    end

    station:RequestRefueling(Player.PlayerData.citizenid, maxRefueling)
    cb(station:GetAvailableStock())
end)

QBCore.Functions.CreateCallback("fuel:server:FinishRefuel", function(source, cb, id, refueling, netVehicle)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        cb(false)
        return
    end

    local station = StationsList[id]
    if station == nil then
        cb(false)
        return
    end

    local vehicle = NetworkGetEntityFromNetworkId(netVehicle)
    if vehicle == 0 then
        cb(false)
        return
    end

    if not station:VehicleAccessFuel(vehicle) then
        TriggerClientEvent("hud:client:DrawNotification", source, "Vous n'avez pas accès à ce type de carburant.", "error")
        cb(false)
        return
    end

    refueling = math.floor(refueling)
    if station:GetRefueling(Player.PlayerData.citizenid) < refueling then
        cb(false)
        return
    end

    local cost = math.ceil((refueling * station:GetPrice()))

    if Player.Functions.RemoveMoney("money", cost) then
        Entity(vehicle).state.fuel = (Entity(vehicle).state.fuel or 0.0) + refueling
        station:FinishedRefueling(Player.PlayerData.citizenid, refueling)
        saveStation(id)

        if station:IsPublic() then
            TriggerClientEvent("hud:client:DrawNotification", source, "Vous venez de faire le plein de votre véhicule pour ~r~$" .. cost .. "~s~ (~g~" .. refueling .. "L~s~).")
        elseif station:IsPrivate() then
            TriggerClientEvent("hud:client:DrawNotification", source, "Vous venez de faire le plein de votre véhicule (~g~" .. refueling .. "L~s~).")
        end

        cb(true)
    else
        cb(false)
    end
end)

--- Events
RegisterNetEvent("fuel:server:GetStation", function(cb, id)
    cb(StationsList[id])
end)

RegisterNetEvent("fuel:server:AddStationStock", function(id, amount)
    local station = StationsList[id]
    if station == nil then
        return
    end

    station.stock = station.stock + tonumber(amount)
    if station.stock > 2000 then
        station.stock = 2000
    end
    saveStation(id)
end)

--- Items
QBCore.Functions.CreateUseableItem("essence_jerrycan", function(source, item)
    TriggerClientEvent("soz-fuel:client:onJerrycanEssence", source)
end)

QBCore.Functions.CreateCallback("fuel:server:useJerrycanEssence", function(source, cb, netVehicle)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        cb(false)
        return
    end

    local vehicle = NetworkGetEntityFromNetworkId(netVehicle)
    if vehicle == 0 then
        cb(false)
        return
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "essence_jerrycan", 1) then
        Entity(vehicle).state.fuel = (Entity(vehicle).state.fuel or 0.0) + Config.JerryCanRefill
    end

    cb(true)
end)

QBCore.Functions.CreateUseableItem("kerosene_jerrycan", function(source, item)
    TriggerClientEvent("soz-fuel:client:onJerrycanKerosene", source)
end)

QBCore.Functions.CreateCallback("fuel:server:useJerrycanKerosene", function(source, cb, netVehicle)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        cb(false)
        return
    end

    local vehicle = NetworkGetEntityFromNetworkId(netVehicle)
    if vehicle == 0 then
        cb(false)
        return
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "kerosene_jerrycan", 1) then
        Entity(vehicle).state.fuel = (Entity(vehicle).state.fuel or 0.0) + Config.JerryCanRefill
    end

    cb(true)
end)

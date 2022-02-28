local QBCore = exports["qb-core"]:GetCoreObject()
local OutsideVehicles = {}

QBCore.Functions.CreateCallback("qb-garage:server:GetGarageVehicles", function(source, cb, garage, type, category)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    if type == "public" or type == "private" then -- Public garages give player cars in the garage only
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE citizenid = ? AND garage = ? AND state = ?", {
            pData.PlayerData.citizenid,
            garage,
            1,
        }, function(result)
            if result[1] then
                cb(result, os.time())
            else
                cb(nil)
            end
        end)
    elseif type == "depot" then -- Depot give player cars that are not in garage only
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE citizenid = ? AND (state = ? OR state = ?)", {
            pData.PlayerData.citizenid,
            0,
            2,
        }, function(result)
            local tosend = {}
            if result[1] then
                -- Check vehicle type against depot type
                for k, vehicle in pairs(result) do
                    if category == "air" and
                        (QBCore.Shared.Vehicles[vehicle.vehicle].category == "helicopters" or QBCore.Shared.Vehicles[vehicle.vehicle].category == "planes") then
                        tosend[#tosend + 1] = vehicle
                    elseif category == "sea" and QBCore.Shared.Vehicles[vehicle.vehicle].category == "boats" then
                        tosend[#tosend + 1] = vehicle
                    elseif category == "car" and QBCore.Shared.Vehicles[vehicle.vehicle].category ~= "helicopters" and
                        QBCore.Shared.Vehicles[vehicle.vehicle].category ~= "planes" and QBCore.Shared.Vehicles[vehicle.vehicle].category ~= "boats" then
                        tosend[#tosend + 1] = vehicle
                    end
                end
                cb(tosend)
            else
                cb(nil)
            end
        end)
    else -- House, Job and Gang, give all cars in the garage
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE garage = ? AND state = ?", {garage, 1}, function(result)
            if result[1] then
                cb(result)
            else
                cb(nil)
            end
        end)
    end
end)

QBCore.Functions.CreateCallback("qb-garage:server:checkOwnership", function(source, cb, plate, type, house, gang)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    if type == "public" or type == "private" then -- Public garages only for player cars
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE plate = ? AND citizenid = ?", {
            plate,
            pData.PlayerData.citizenid,
        }, function(result)
            if result[1] then
                cb(true)
            else
                cb(false)
            end
        end)
    elseif type == "house" then -- House garages only for player cars that have keys of the house
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE plate = ?", {v.plate}, function(result)
            if result[1] then
                local hasHouseKey = exports["qb-houses"]:hasKey(result[1].license, result[1].citizenid, house)
                if hasHouseKey then
                    cb(true)
                else
                    cb(false)
                end
            else
                cb(false)
            end
        end)
    elseif type == "gang" then -- Gang garages only for gang members cars (for sharing)
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE plate = ?", {v.plate}, function(result)
            if result[1] then
                -- Check if found owner is part of the gang
                local resultplayer = MySQL.Sync.fetchSingle("SELECT * FROM players WHERE citizenid = ?", {
                    result[1].citizenid,
                })
                if resultplayer then
                    local playergang = json.decode(resultplayer.gang)
                    if playergang.name == gang then
                        cb(true)
                    else
                        cb(false)
                    end
                else
                    cb(false)
                end
            else
                cb(false)
            end
        end)
    else -- Job garages only for cars that are owned by someone (for sharing and service)
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE plate = ?", {plate}, function(result)
            if result[1] then
                cb(true)
            else
                cb(false)
            end
        end)
    end
end)

QBCore.Functions.CreateCallback("qb-garage:server:GetVehicleProperties", function(source, cb, plate)
    local src = source
    local properties = {}
    local result = MySQL.Sync.fetchAll("SELECT mods FROM player_vehicles WHERE plate = ?", {plate})
    if result[1] then
        properties = json.decode(result[1].mods)
    end
    cb(properties)
end)

RegisterNetEvent("qb-garage:server:updateVehicle", function(state, fuel, engine, body, plate, garage, type)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local parkingtime = 0
    if type == "private" then
        parkingtime = os.time()
    end
    MySQL.Async.execute("UPDATE player_vehicles SET state = ?, garage = ?, fuel = ?, engine = ?, body = ?, parkingtime = ? WHERE plate = ? AND citizenid = ?",
                        {state, garage, fuel, engine, body, parkingtime, plate, pData.PlayerData.citizenid})
end)

RegisterNetEvent("qb-garage:server:updateVehicleState", function(state, plate, garage)
    MySQL.Async.execute("UPDATE player_vehicles SET state = ?, garage = ?, depotprice = ? WHERE plate = ?", {
        state,
        garage,
        0,
        plate,
    })
end)

RegisterNetEvent("qb-garages:server:UpdateOutsideVehicles", function(Vehicles)
    local src = source
    local Ply = QBCore.Functions.GetPlayer(src)
    local CitizenId = Ply.PlayerData.citizenid
    OutsideVehicles[CitizenId] = Vehicles
end)

AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        Wait(100)
        MySQL.Async.execute("UPDATE player_vehicles SET state = 2, depotprice = 100 WHERE state = 0", {})
    end
end)

RegisterNetEvent("qb-garage:server:PayDepotPrice", function(v, type, garage, indexgarage)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local moneyBalance = Player.PlayerData.money["money"]
    MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE plate = ?", {v.plate}, function(result)
        if result[1] then
            if moneyBalance >= result[1].depotprice then
                Player.Functions.RemoveMoney("money", result[1].depotprice, "paid-depot")
                TriggerClientEvent("qb-garages:client:takeOutGarage", src, v, type, garage, indexgarage)
            else
                TriggerClientEvent("hud:client:DrawNotification", src, Lang:t("error.not_enough"))
            end
        end
    end)
end)

RegisterNetEvent("qb-garage:server:PayPrivePrice", function(v, type, garage, indexgarage, price)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local moneyBalance = Player.PlayerData.money["money"]
    if moneyBalance >= price then
        Player.Functions.RemoveMoney("money", price, "paid-prive")
        TriggerClientEvent("qb-garages:client:takeOutGarage", src, v, type, garage, indexgarage)
    else
        TriggerClientEvent("hud:client:DrawNotification", src, Lang:t("error.not_enough"))
    end
end)

-- External Calls
QBCore.Functions.CreateCallback("qb-garage:server:checkVehicleOwner", function(source, cb, plate)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    MySQL.Async.fetchSingle("SELECT * FROM player_vehicles WHERE plate = ? AND citizenid = ?", {
        plate,
        pData.PlayerData.citizenid,
    }, function(result)
        if result[1] then
            cb(true, result[1].balance)
        else
            cb(false)
        end
    end)
end)

QBCore.Functions.CreateCallback("qb-garage:server:GetPlayerVehicles", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    local Vehicles = {}
    MySQL.Async.fetchSingle("SELECT * FROM player_vehicles WHERE citizenid = ?", {Player.PlayerData.citizenid}, function(result)
        if result[1] then
            for k, v in pairs(result) do
                local VehicleData = QBCore.Shared.Vehicles[v.vehicle]

                local VehicleGarage = Lang:t("error.no_garage")
                if v.garage ~= nil then
                    if Garages[v.garage] ~= nil then
                        VehicleGarage = Garages[v.garage].label
                    else
                        VehicleGarage = Lang:t("info.house_garage") -- HouseGarages[v.garage].label
                    end
                end

                if v.state == 0 then
                    v.state = Lang:t("status.out")
                elseif v.state == 1 then
                    v.state = Lang:t("status.garaged")
                elseif v.state == 2 then
                    v.state = Lang:t("status.impound")
                end

                local fullname
                if VehicleData["brand"] ~= nil then
                    fullname = VehicleData["brand"] .. " " .. VehicleData["name"]
                else
                    fullname = VehicleData["name"]
                end
                Vehicles[#Vehicles + 1] = {
                    fullname = fullname,
                    brand = VehicleData["brand"],
                    model = VehicleData["name"],
                    plate = v.plate,
                    garage = VehicleGarage,
                    state = v.state,
                    fuel = v.fuel,
                    engine = v.engine,
                    body = v.body,
                }
            end
            cb(Vehicles)
        else
            cb(nil)
        end
    end)
end)

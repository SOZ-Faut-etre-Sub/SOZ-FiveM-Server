local QBCore = exports["qb-core"]:GetCoreObject()
local garage_props = GetHashKey("soz_prop_paystation")

CreateThread(function()
    for _, garage in pairs(Garages) do
        if garage.type == "entreprise" then
            exports["soz-utils"]:CreateObject(garage_props, garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z, garage.blipcoord.w, 8000.0, true)
        end
    end
end)

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
                local resultplayer = MySQL.Sync.fetchSingle("SELECT * FROM player WHERE citizenid = ?", {
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
    elseif type == "entreprise" then -- Job garages only for cars that are owned by someone (for sharing and service)
        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE plate = ? AND citizenid = ?", {
            plate,
            pData.PlayerData.citizenid,
        }, function(result)
            if result[1] then
                cb(result[1])
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
    if type == "private" or type == "depot" then
        parkingtime = os.time()
    end
    if type ~= "entreprise" then
        MySQL.Async.execute(
            "UPDATE player_vehicles SET state = ?, garage = ?, fuel = ?, engine = ?, body = ?, parkingtime = ? WHERE plate = ? AND citizenid = ?",
            {state, garage, fuel, engine, body, parkingtime, plate, pData.PlayerData.citizenid})
    else
        MySQL.Async.execute(
            "UPDATE player_vehicles SET license = NULL, citizenid = NULL, state = ?, garage = ?, fuel = ?, engine = ?, body = ?, parkingtime = ? WHERE plate = ? AND citizenid = ?",
            {state, garage, fuel, engine, body, parkingtime, plate, pData.PlayerData.citizenid})
    end
end)

RegisterNetEvent("qb-garage:server:setVehicleInPound", function(plate)
    local parkingtime = os.time()
    MySQL.Async.execute("UPDATE player_vehicles SET state = 2, garage = 'fourriere', parkingtime = ? WHERE plate = ?", {
        parkingtime,
        plate,
    })
end)

RegisterNetEvent("qb-garage:server:setVehicleDestroy", function(plate)
    MySQL.Async.execute("UPDATE player_vehicles SET state = 5 WHERE plate = ?", {plate})
end)

RegisterNetEvent("qb-garage:server:updateVehicleState", function(state, plate, garage)
    MySQL.Async.execute("UPDATE player_vehicles SET state = ?, garage = ? WHERE plate = ?", {state, garage, plate})
end)

RegisterNetEvent("qb-garage:server:updateVehicleCitizen", function(plate)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local cid = pData.PlayerData.citizenid
    MySQL.Async.execute("UPDATE player_vehicles SET license = ?, citizenid = ? WHERE plate = ?", {
        pData.PlayerData.license,
        cid,
        plate,
    })
end)

AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        Wait(100)
        MySQL.Async.execute("UPDATE player_vehicles SET state = 1, garage = 'airportpublic' WHERE state = 0 AND job IS NULL", {})
        MySQL.Async.execute("UPDATE player_vehicles SET state = 3, garage = job WHERE state = 0 AND job IS NOT NULL", {})

        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE state = 2 OR state = 4", {}, function(result)
            if result[1] then
                for k, v in pairs(result) do
                    local jours = os.difftime(os.time(), v.parkingtime) / (24 * 60 * 60) -- seconds in a day
                    local joursentiers = math.floor(jours)
                    if (v.state == 2 and joursentiers > 6) or (v.state == 4 and joursentiers > 2) then
                        MySQL.Async.execute("UPDATE player_vehicles SET state = 5 WHERE id = ?", {v.id})
                    end
                end
            end
        end)
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

QBCore.Functions.CreateCallback("qb-garage:server:getstock", function(source, cb, indexgarage)
    local parkingcount = MySQL.Sync.fetchSingle("SELECT COUNT(*) FROM player_vehicles WHERE garage = ? AND state = 1", {
        indexgarage,
    })
    if parkingcount then
        cb(parkingcount)
    end
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

QBCore.Functions.CreateCallback("qb-garage:server:GetPlayerEntreprise", function(source, cb)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE job = ?", {Player.PlayerData.job.id}, function(result)
        if result[1] then
            cb(result)
        else
            cb(nil)
        end
    end)
end)

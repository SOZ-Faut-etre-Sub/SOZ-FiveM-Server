local QBCore = exports["qb-core"]:GetCoreObject()
local SozJobCore = exports["soz-jobs"]:GetCoreObject()
local garage_props = GetHashKey("soz_prop_paystation")

local spawnLock = {}

AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        Wait(100)
        MySQL.Async.execute("UPDATE player_vehicles SET state = 1, garage = 'airportpublic' WHERE state = 0 AND job IS NULL AND category = 'car'", {})
        MySQL.Async.execute("UPDATE player_vehicles SET state = 1, garage = 'airport_air' WHERE state = 0 AND job IS NULL AND category = 'air'", {})
        MySQL.Async.execute("UPDATE player_vehicles SET state = 3, garage = job WHERE state = 0 AND job IS NOT NULL AND category = 'car'", {})
        MySQL.Async.execute("UPDATE player_vehicles SET state = 3, garage = concat(job,'_air') WHERE state = 0 AND job IS NOT NULL AND category = 'air'", {})

        MySQL.Async.execute("UPDATE player_vehicles SET garage = 'mtp' WHERE garage = 'oil'", {})
        MySQL.Async.execute("UPDATE player_vehicles SET garage = 'stonk' WHERE garage = 'cash-transfer'", {})
        MySQL.Async.execute("UPDATE player_vehicles SET garage = 'fourriere' WHERE state = 2 AND garage != 'fourriere'", {})

        MySQL.Async.fetchAll("SELECT * FROM player_vehicles WHERE state = 2 OR state = 4 OR state = 1", {}, function(result)
            if result[1] then
                for k, v in pairs(result) do
                    local jours = os.difftime(os.time(), v.parkingtime) / (24 * 60 * 60) -- seconds in a day
                    local joursentiers = math.floor(jours)
                    if (v.state == 1 and joursentiers > 21) then
                        MySQL.Async.execute("UPDATE player_vehicles SET state = 2, parkingtime = ?, garage = 'fourriere' WHERE id = ?", {
                            os.time(),
                            v.id,
                        })
                    elseif (v.state == 2 and joursentiers > 7) then
                        MySQL.Async.execute("UPDATE player_vehicles SET state = 5, parkingtime = ? WHERE id = ?", {
                            os.time(),
                            v.id,
                        })
                        MySQL.Async.execute("UPDATE concess_storage SET stock = stock + 1 WHERE model = ?", {v.vehicle})
                    elseif (v.state == 4 and joursentiers > 2) then
                        MySQL.Async.execute("UPDATE player_vehicles SET state = 5 WHERE id = ?", {v.id})
                    end
                end
            end
        end)

        for _, garage in pairs(Garages) do
            if garage.type == "entreprise" then
                exports["soz-utils"]:CreateObject(garage_props, garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z, garage.blipcoord.w, 8000.0, true)
            end
        end
    end
end)

--
-- Spawn Lock
--
local function IsSpawnLocked(plate)
    return spawnLock[plate] ~= nil
end

local function SetSpawnLock(plate, lockThisPlate)
    if lockThisPlate and IsSpawnLocked(plate) then
        return -1
    end

    if lockThisPlate then
        spawnLock[plate] = true
    elseif spawnLock ~= nil then
        spawnLock[plate] = nil
    end

    return IsSpawnLocked(plate)
end

QBCore.Functions.CreateCallback("soz-garage:server:SetSpawnLock", function(source, cb, plate, lockThisPlate)
    cb(SetSpawnLock(plate, lockThisPlate))
end)

---Precheck data stored in DB (citizenid, plate, state)
---Data should strictly match. This is to avoid duplication glitches
---@param source number
---@param type_ string Garage type: public, private, entreprise, depot
---@param plate string
---@param expectedState number current DB record should match data in this table
---                            { <db_field> = <expected value> }
local function PrecheckCurrentVehicleStateInDB(source, type_, plate, expectedState)
    local vehicle = MySQL.Sync.fetchSingle("SELECT * FROM player_vehicles WHERE plate = ?", {plate})

    if vehicle == nil then
        TriggerClientEvent("hud:client:DrawNotification", source, "Véhicule invalide, ne figure pas dans les registres", "error")
        return false
    else
        local player = QBCore.Functions.GetPlayer(source)

        local fields = {
            -- Check ownership
            ["citizenid"] = {
                expectation = expectedState.citizenid or player.PlayerData.citizenid,
                error = "Le véhicule ne vous appartient pas",
            },
            -- Check state is the expected value
            ["state"] = {expectation = expectedState.state, error = "Le véhicule présente une dualité quantique"},
            -- Check vehicle is is right garage
            ["garage"] = {expectation = expectedState.garage, error = "Le véhicule est doué d'ubiquité"},
        }
        -- Remove checks that are not relevent for current vehicle. `citizenid` and `state` always to be checked
        local fieldsToTest = {}
        for field, data in pairs(fields) do
            if (field == "citizenid" and type_ ~= "entreprise" and type_ ~= "depot" and type_ ~= "public") or field == "state" or expectedState[field] then
                fieldsToTest[field] = data
            end
        end

        -- Special case for entreprise garage (only check if player is in entreprise, vehicle does not have to be owned by entreprise)
        if type_ == "entreprise" then
            if player.PlayerData.job == nil or player.PlayerData.job.id ~= expectedState.job then
                TriggerClientEvent("hud:client:DrawNotification", source, "Vous n'avez pas accès à ce garage entreprise", "error")
                return false
            end
        end

        -- Test all fields
        for field, data in pairs(fieldsToTest) do
            local expectation = data.expectation
            local doesMatch = false

            if type(expectation) == "table" then
                for _, value in ipairs(expectation) do
                    doesMatch = doesMatch or vehicle[field] == value
                end
            else
                doesMatch = vehicle[field] == data.expectation
            end

            if not doesMatch then
                TriggerClientEvent("hud:client:DrawNotification", source, fields[field].error, "error")
                return false
            end
        end
    end

    return true
end

QBCore.Functions.CreateCallback("soz-garage:server:IsVehicleOwned", function(source, cb, plate)
    local vehicle = MySQL.Sync.fetchSingle("SELECT * FROM player_vehicles WHERE plate = ?", {plate})

    cb(vehicle ~= nil)
end)

QBCore.Functions.CreateCallback("soz-garage:server:CheckCanGoOut", function(source, cb, type_, plate, expectedState)
    cb(PrecheckCurrentVehicleStateInDB(source, type_, plate, expectedState))
end)

---List vehicles in specified garage
---@param garage string Current garage
---@param type_ string Garage type: public, private, entreprise, depot
---@param category string Vehicle category: car, air, sea
QBCore.Functions.CreateCallback("soz-garage:server:GetGarageVehicles", function(source, cb, garage, type_, category)
    local player = QBCore.Functions.GetPlayer(source)
    local cid = player.PlayerData.citizenid

    local query = "SELECT * FROM player_vehicles WHERE"
    local args = {}

    local argsByType = {
        ["public"] = {state = VehicleState.InGarage, garage = garage, category = category},
        ["private"] = {state = VehicleState.InGarage, citizenid = cid, garage = garage, category = category},
        ["depot"] = {state = VehicleState.InPound},
        ["entreprise"] = {state = VehicleState.InEntreprise, garage = garage, category = category},
        ["housing"] = {state = VehicleState.InGarage, citizenid = cid, garage = garage, category = category},
    }
    local allArgs = argsByType[type_]
    if not allArgs then
        error(string.format("Invalid garage type_: %s", type_))
    end

    local index = 1
    for field, value in pairs(allArgs) do
        if index == 1 then
            query = query .. string.format(" %s = ?", field)
        else
            query = query .. string.format(" AND %s = ?", field)
        end
        table.insert(args, value)
        index = index + 1
    end

    -- Special case for pound and entreprise vehicle
    if type_ == "depot" or type_ == "public" then
        local canTakeOutPoundJob = SozJobCore.Functions.HasPermission(player.PlayerData.job.id, player.PlayerData.job.id, player.PlayerData.job.grade,
                                                                      SozJobCore.JobPermission.SocietyTakeOutPound)
        if canTakeOutPoundJob then
            query = query .. " AND (citizenid = ? OR job = ?)"
            table.insert(args, cid)
            table.insert(args, player.PlayerData.job.id)
        else
            query = query .. " AND citizenid = ?"
            table.insert(args, cid)
        end
    end

    local vehicles = MySQL.Sync.fetchAll(query, args)
    if #vehicles > 0 then
        cb(vehicles, os.time())
    else
        cb(nil)
    end
end)

QBCore.Functions.CreateCallback("soz-garage:server:UpdateVehicleProperties", function(source, cb, vehicleNetId)
    local query = "SELECT mods FROM player_vehicles WHERE plate = ?"
    local veh = NetworkGetEntityFromNetworkId(vehicleNetId)
    local owner = NetworkGetEntityOwner(veh)
    local result = MySQL.Sync.fetchAll(query, {GetVehicleNumberPlateText(veh)})
    if result[1] ~= nil then
        local mods = json.decode(result[1].mods)
        mods.engineHealth = nil
        mods.tireHealth = nil
        mods.tankHealth = nil
        mods.dirtLevel = nil
        mods.bodyHealth = nil
        mods.oilLevel = nil
        mods.fuelLevel = nil
        mods.windowStatus = nil
        mods.tireBurstState = nil
        mods.tireBurstCompletely = nil
        mods.doorStatus = nil
        TriggerClientEvent("soz-garage:client:UpdateVehicleMods", owner, vehicleNetId, mods)
        cb(true)
    else
        cb(false)
    end
end)

---Spawn Vehicle out of garage, server-side
---@param modelName string
---@param coords vector4 Spawn location
---@param mods table Vehicle properties
QBCore.Functions.CreateCallback("soz-garage:server:SpawnVehicle", function(source, cb, modelName, coords, mods, condition)
    if not condition then
        condition = {}
        condition.fuelLevel = 1000
        condition.engineHealth = 1000
    end
    local veh = SpawnVehicle(modelName, coords, mods.plate, condition.fuelLevel or 100)
    if not veh then
        SetSpawnLock(mods.plate, false)
        exports["soz-monitor"]:Log("ERROR", ("Vehcile %s fail to spawn (Vehicle is nil)"):format(mods.plate))
        cb(nil)
        return
    end

    Entity(veh).state:set("mods", json.encode(mods), true)
    Entity(veh).state:set("condition", json.encode(condition), true)

    local res = MySQL.Sync.execute([[
        UPDATE player_vehicles
        SET state = ?, garage = null, parkingtime = 0
        WHERE plate = ?
    ]], {VehicleState.Out, mods.plate})
    if not res == 1 then
        DespawnVehicle(NetworkGetNetworkIdFromEntity(veh))
        exports["soz-monitor"]:Log("ERROR", ("Vehcile %s fail to spawn (MYSQL query fail)"):format(mods.plate))
        return
    end

    TriggerClientEvent("vehiclekeys:client:SetOwner", source, mods.plate)

    SetSpawnLock(mods.plate, false)

    cb(NetworkGetNetworkIdFromEntity(veh))
end)

---Make player pay parking fee (private, pound)
---@param type_ string Garage type: public, private, entreprise, depot
---@param vehicle table player_vehicles row representation
QBCore.Functions.CreateCallback("soz-garage:server:PayParkingFee", function(source, cb, type_, vehicle, qbVehicleKey)
    local player = QBCore.Functions.GetPlayer(source)

    local qbVehicle = exports["soz-vehicle"]:GetVehiclesByModels()[vehicle.vehicle]
    local price = math.ceil(qbVehicle["price"] * 0.15)
    if type_ == "private" then
        local timediff = math.floor((os.time() - vehicle.parkingtime) / 3600)
        price = timediff * 20
        if price > 200 then
            price = 200
        end
    end

    if player.Functions.RemoveMoney("money", price, string.format("paid-%s", type_)) then
        if type == "depot" then
            bennysFee = math.ceil(qbVehicle["price"] * 0.02)
            MySQL.Async.execute("UPDATE bank_accounts SET money = money + ? WHERE account_type = 'business' AND businessid = 'bennys'", {
                bennysFee,
            })
        end
        cb(true)
    else
        TriggerClientEvent("hud:client:DrawNotification", source, Lang:t("error.not_enough"), "error")
        cb(false)
    end
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
        MySQL.Async.execute("UPDATE player_vehicles SET state = ?, garage = ?, fuel = ?, engine = ?, body = ?, parkingtime = ? WHERE plate = ? AND job = ?",
                            {state, garage, fuel, engine, body, parkingtime, plate, pData.PlayerData.job.id})
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

QBCore.Functions.CreateCallback("soz-garage:server:getstock", function(source, cb, indexgarage)
    local parkingcount = MySQL.Sync.fetchSingle("SELECT COUNT(*) FROM player_vehicles WHERE garage = ? AND state = 1", {
        indexgarage,
    })
    if parkingcount then
        cb(parkingcount)
    end
end)

---Return vehicle's data to be stored
---@param vehNetId number Vehicle Network ID
---@param extraData table Extra data coming from client (fuel)
---@return table
local function GetVehicleData(vehNetId, extraData)
    local entityId = NetworkGetEntityFromNetworkId(vehNetId)

    local data = {
        plate = GetVehicleNumberPlateText(entityId),
        engineDamage = math.floor(GetVehicleEngineHealth(entityId) + 0.5) or 500,
    }

    local extra = {fuel = 10, bodyDamage = 1000, properties = json.encode({})}
    for attr, default in pairs(extra) do
        data[attr] = extraData[attr] or default
    end

    return data
end

local function UpdateVehicleMods(vehicleNetId, vehicleExtraData)
    if vehicleExtraData then
        vehicleExtraData.engineHealth = nil
        vehicleExtraData.tireHealth = nil
        vehicleExtraData.tankHealth = nil
        vehicleExtraData.dirtLevel = nil
        vehicleExtraData.bodyHealth = nil
        vehicleExtraData.oilLevel = nil
        vehicleExtraData.fuelLevel = nil
        vehicleExtraData.windowStatus = nil
        vehicleExtraData.tireBurstState = nil
        vehicleExtraData.tireBurstCompletely = nil
        vehicleExtraData.doorStatus = nil

        local query = [[
            UPDATE player_vehicles
            SET mods = ?
            WHERE plate = ?
        ]]

        local mods = json.encode(vehicleExtraData)
        local veh = NetworkGetEntityFromNetworkId(vehicleNetId)

        Entity(veh).state:set("mods", mods, true)

        exports["soz-monitor"]:Log("INFO", ("Vehcile %s customisation update %s"):format(mods.plate, mods))

        local plate = GetVehicleNumberPlateText(veh)
        local args = {mods, plate}

        local res = MySQL.Sync.execute(query, args)
        return res == 1
    end
    return false
end

QBCore.Functions.CreateCallback("soz-garage:server:UpdateVehicleMods", function(source, cb, vehicleNetId, vehicleExtraData)
    cb(UpdateVehicleMods(vehicleNetId, vehicleExtraData))
end)

QBCore.Functions.CreateCallback("soz-garage:server:ParkVehicleInGarage", function(source, cb, type_, indexgarage, vehicleNetId, vehicleExtraData)
    local player = QBCore.Functions.GetPlayer(source)

    local state = 1
    if type_ == "entreprise" then
        state = 3
    end

    local checkMods = "SELECT mods FROM player_vehicles WHERE plate = ?"

    local decodedExtra1 = json.decode(vehicleExtraData.properties)
    local data1 = GetVehicleData(vehicleNetId, vehicleExtraData)

    local mods = MySQL.Sync.fetchAll(checkMods, {data1.plate})

    local decodedMods = json.decode(mods[1].mods)
    if decodedMods then
        if next(decodedMods) == nil then
            exports["soz-monitor"]:Log("INFO", ("Vehcile %s no default mods set"):format(decodedExtra1.plate))
            UpdateVehicleMods(vehicleNetId, decodedExtra1)
        end
    end

    local query = [[
        UPDATE player_vehicles
        SET `condition` = ?, state = ?, garage = ?, fuel = ?, engine = ?, body = ?, parkingtime = ?
        WHERE plate = ?
    ]]

    local conditionVehicle = {}
    local decodedExtra = json.decode(vehicleExtraData.properties)
    local data = GetVehicleData(vehicleNetId, vehicleExtraData)
    conditionVehicle["engineHealth"] = decodedExtra.engineHealth
    conditionVehicle["tireHealth"] = decodedExtra.tireHealth
    conditionVehicle["tankHealth"] = decodedExtra.tankHealth
    conditionVehicle["dirtLevel"] = decodedExtra.dirtLevel
    conditionVehicle["bodyHealth"] = decodedExtra.bodyHealth
    conditionVehicle["oilLevel"] = decodedExtra.oilLevel
    conditionVehicle["fuelLevel"] = decodedExtra.fuelLevel
    conditionVehicle["windowStatus"] = decodedExtra.windowStatus
    conditionVehicle["tireBurstState"] = decodedExtra.tireBurstState
    conditionVehicle["tireBurstCompletely"] = decodedExtra.tireBurstCompletely
    conditionVehicle["doorStatus"] = decodedExtra.doorStatus

    local args = {
        json.encode(conditionVehicle),
        state,
        indexgarage,
        data.fuel,
        data.engineDamage,
        data.bodyDamage,
        os.time(),
        data.plate,
    }

    if type_ ~= "entreprise" then
        query = query .. " AND citizenid = ?"
        table.insert(args, player.PlayerData.citizenid)
    end

    local res = MySQL.Sync.execute(query, args)
    if res == 1 then
        DespawnVehicle(vehicleNetId)
        cb(true)
    else
        cb(false)
    end
end)

QBCore.Functions.CreateCallback("soz-garage:server:ParkVehicleInDepot", function(source, cb, indexgarage, vehicleNetId, vehicleExtraData)
    local query = [[
        UPDATE player_vehicles
        SET state = 2, garage = ?, fuel = ?, engine = ?, body = ?, parkingtime = ?
        WHERE plate = ?
    ]]

    local data = GetVehicleData(vehicleNetId, vehicleExtraData)
    local args = {indexgarage, data.fuel, data.engineDamage, data.bodyDamage, os.time(), data.plate}

    local res = MySQL.Sync.execute(query, args)
    if res == 1 then
        DespawnVehicle(vehicleNetId)
        cb(true)
    else
        cb(false)
    end
end)

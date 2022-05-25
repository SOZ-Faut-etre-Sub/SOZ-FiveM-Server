local QBCore = exports["qb-core"]:GetCoreObject()
local SozJobCore = exports["soz-jobs"]:GetCoreObject()
local garage_props = GetHashKey("soz_prop_paystation")

AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        Wait(100)
        MySQL.Async.execute("UPDATE player_vehicles SET state = 1, garage = 'airportpublic' WHERE state = 0 AND job IS NULL", {})
        MySQL.Async.execute("UPDATE player_vehicles SET state = 3, garage = job WHERE state = 0 AND job IS NOT NULL", {})

        MySQL.Async.execute("UPDATE player_vehicles SET garage = 'mtp' WHERE garage = 'oil'", {})
        MySQL.Async.execute("UPDATE player_vehicles SET garage = 'stonk' WHERE garage = 'cash-transfer'", {})

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

        for _, garage in pairs(Garages) do
            if garage.type == "entreprise" then
                exports["soz-utils"]:CreateObject(garage_props, garage.blipcoord.x, garage.blipcoord.y, garage.blipcoord.z, garage.blipcoord.w, 8000.0, true)
            end
        end
    end
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
            ["citizenid"] = {expectation = expectedState.citizenid or player.PlayerData.citizenid, error = "Le véhicule ne vous appartient pas"},
            -- Check state is the expected value
            ["state"] = {expectation = expectedState.state, error = "Le véhicule présente une dualité quantique"},
            -- Check vehicle is owned by entreprise
            ["job"] = {expectation = expectedState.job, error = "Ce n'est pas un véhicule entreprise"},
            -- Check vehicle is is right garage
            ["garage"] = {expectation = expectedState.garage, error = "Le véhicule est doué d'ubiquité"},
        }
        -- Remove checks that are not relevent for current vehicle. `citizenid` and `state` always to be checked
        local fieldsToTest = {}
        for field, data in pairs(fields) do
            if field == "citizenid" or field == "state" or expectedState[field] then
                fieldsToTest[field] = data
            end
        end

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

    return vehicle
end

QBCore.Functions.CreateCallback("soz-garage:server:PrecheckCurrentVehicleStateInDB", function(source, cb, type_, plate, expectedState)
    local vehicle = PrecheckCurrentVehicleStateInDB(source, type_, plate, expectedState)
    if vehicle then
    cb(vehicle)
    else
        cb(false)
    end
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
        ["public"] = {state = VehicleState.InGarage, citizenid = cid, garage = garage},
        ["private"] = {state = VehicleState.InGarage, citizenid = cid, garage = garage},
        ["depot"] = {state = VehicleState.InPound},
        ["entreprise"] = {state = VehicleState.InEntreprise, job = player.PlayerData.job.id},
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
    if type_ == "depot" then
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

QBCore.Functions.CreateCallback("qb-garage:server:GetVehicleProperties", function(source, cb, plate)
    local src = source
    local properties = {}
    local result = MySQL.Sync.fetchAll("SELECT mods FROM player_vehicles WHERE plate = ?", {plate})
    if result[1] then
        properties = json.decode(result[1].mods)
    end
    cb(properties)
end)

QBCore.Functions.CreateCallback("qb-garage:server:CanTakeOutVehicle", function(source, cb, plate)
    local vehicle = MySQL.Sync.fetchSingle("SELECT state FROM player_vehicles WHERE plate = ?", {plate})

    if vehicle then
        -- Only Takeout Vehicle
        cb(vehicle.state == 1 or vehicle.state == 2 or vehicle.state == 3)
    else
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

---Return vehicle's data to be stored
---@param vehNetId number Vehicle Network ID
---@param extraData table Extra data coming from client (fuel)
---@return table
local function GetVehicleData(vehNetId, extraData)
    local entityId = NetworkGetEntityFromNetworkId(vehNetId)

    local data = {
        plate = GetVehicleNumberPlateText(entityId),
        bodyDamage = math.ceil(GetVehicleBodyHealth(entityId)) or 500,
        engineDamage = math.ceil(GetVehicleEngineHealth(entityId)) or 500,
    }

    local extra = {fuel = 10, properties = json.encode({})}
    for attr, default in pairs(extra) do
        data[attr] = extraData[attr] or default
    end

    return data
end

QBCore.Functions.CreateCallback("soz-garage:server:ParkVehicleInGarage", function(source, cb, type_, indexgarage, vehicleNetId, vehicleExtraData)
    local player = QBCore.Functions.GetPlayer(source)

    local state = 1
    if type_ == "entreprise" then
        state = 3
    end

    local query = [[
        UPDATE player_vehicles
        SET state = ?, garage = ?, fuel = ?, engine = ?, body = ?, mods = ?, parkingtime = ?
        WHERE plate = ?
    ]]

    local data = GetVehicleData(vehicleNetId, vehicleExtraData)
    local args = {
        state,
        indexgarage,
        data.fuel,
        data.engineDamage,
        data.bodyDamage,
        data.properties,
        os.time(),
        data.plate,
    }

    if type == "entreprise" then
        query = query .. " AND job = ?"
        table.insert(args, player.PlayerData.job.id)
    else
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

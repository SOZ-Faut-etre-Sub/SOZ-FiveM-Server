local QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback("qb-garagehousing:server:GetGarageVehicles", function(source, cb, garage, type, category)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    if type == "housing" then
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
    end
end)

QBCore.Functions.CreateCallback("qb-garagehousing:server:checkOwnership", function(source, cb, plate, type, house, gang)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    if type == "housing" then
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
    end
end)

QBCore.Functions.CreateCallback("qb-garagehousing:server:GetVehicleProperties", function(source, cb, plate)
    local src = source
    local properties = {}
    local result = MySQL.Sync.fetchAll("SELECT mods FROM player_vehicles WHERE plate = ?", {plate})
    if result[1] then
        properties = json.decode(result[1].mods)
    end
    cb(properties)
end)

RegisterNetEvent("qb-garagehousing:server:updateVehicle", function(state, fuel, engine, body, plate, garage, type)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    if type ~= "entreprise" then
        MySQL.Async.execute(
            "UPDATE player_vehicles SET state = ?, garage = ?, fuel = ?, engine = ?, body = ?, parkingtime = ? WHERE plate = ? AND citizenid = ?",
            {state, garage, fuel, engine, body, 0, plate, pData.PlayerData.citizenid})
    end
end)

RegisterNetEvent("qb-garagehousing:server:updateVehicleState", function(state, plate, garage)
    MySQL.Async.execute("UPDATE player_vehicles SET state = ?, garage = ? WHERE plate = ?", {state, garage, plate})
end)

RegisterNetEvent("qb-garagehousing:server:updateVehicleCitizen", function(plate)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local cid = pData.PlayerData.citizenid
    MySQL.Async.execute("UPDATE player_vehicles SET license = ?, citizenid = ? WHERE plate = ?", {
        pData.PlayerData.license,
        cid,
        plate,
    })
end)

-- pour le stock tu peux aussi en plus de ça faire une fonction qui va récup le stock du palier de l'appart comme ça tu fais la diff entre le nbr de voiture dans ton garagae appart et le nbr max du palier autorisé
QBCore.Functions.CreateCallback("qb-garagehousing:server:getstock", function(source, cb, indexgarage)
    local parkingcount = MySQL.Sync.fetchSingle("SELECT COUNT(*) FROM player_vehicles WHERE garage = ? AND state = 1", {
        indexgarage,
    })
    if parkingcount then
        cb(parkingcount)
    end
end)

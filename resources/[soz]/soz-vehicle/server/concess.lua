local QBCore = exports["qb-core"]:GetCoreObject()

local function GeneratePlate()
    local plate = QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(2)
    local result = MySQL.Sync.fetchScalar("SELECT plate FROM player_vehicles WHERE plate = ?", {plate})
    if result then
        return GeneratePlate()
    else
        return plate:upper()
    end
end

local function comma_value(amount)
    local formatted = amount
    while true do
        formatted, k = string.gsub(formatted, "^(-?%d+)(%d%d%d)", "%1,%2")
        if (k == 0) then
            break
        end
    end
    return formatted
end

QBCore.Functions.CreateCallback("soz-concess:server:getVehicles", function(source, cb)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if player then
        local vehicles = MySQL.Sync.fetchAll("SELECT * FROM player_vehicles WHERE citizenid = ?", {
            player.PlayerData.citizenid,
        })
        if vehicles[1] then
            cb(vehicles)
        end
    end
end)

QBCore.Functions.CreateCallback("soz-concess:server:getstock", function(source, cb)
    local vehiclestock = MySQL.Sync.fetchAll("SELECT * FROM concess_storage")
    if vehiclestock[1] then
        cb(vehiclestock)
    end
end)

RegisterNetEvent("soz-concess:server:buyShowroomVehicle", function(vehicle)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local cid = pData.PlayerData.citizenid
    local cash = pData.PlayerData.money["cash"]
    local vehiclePrice = QBCore.Shared.Vehicles[vehicle]["price"]
    local plate = GeneratePlate()

    local vehiclestock = MySQL.Sync.fetchAll("SELECT stock FROM concess_storage WHERE model = @model", {
        ["@model"] = vehicle,
    })
    if vehiclestock[1].stock > 0 then
        if cash > vehiclePrice then
            MySQL.Async.insert("INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
                               {pData.PlayerData.license, cid, vehicle, GetHashKey(vehicle), "{}", plate, 0})
            MySQL.Async.execute("UPDATE concess_storage SET stock = stock - 1 WHERE model = ?", {vehicle})
            TriggerClientEvent("QBCore:Notify", src, "Merci pour votre achat!", "success")
            TriggerClientEvent("soz-concess:client:buyShowroomVehicle", src, vehicle, plate)
            pData.Functions.RemoveMoney("cash", vehiclePrice, "vehicle-bought-in-showroom")
        else
            TriggerClientEvent("QBCore:Notify", src, "Pas assez d'argent", "error")
        end
    else
        TriggerClientEvent("QBCore:Notify", src, "Plus de stock", "error")
    end
end)

-- Donner ou vendre la voiture au passager

QBCore.Commands.Add("transferVehicle", "Donner ou vendre le véhicule", {{name = "amount", help = "Montant de vente"}}, false, function(source, args)
    local src = source
    local ped = GetPlayerPed(src)
    local player = QBCore.Functions.GetPlayer(src)
    local citizenid = player.PlayerData.citizenid
    local sellAmount = tonumber(args[1])
    local vehicle = GetVehiclePedIsIn(ped, false)
    if vehicle == 0 then
        return TriggerClientEvent("QBCore:Notify", src, "Vous devez être dans un véhicule", "error")
    end
    local driver = GetPedInVehicleSeat(vehicle, -1)
    local passenger = GetPedInVehicleSeat(vehicle, 0)
    local plate = QBCore.Functions.GetPlate(vehicle)
    local isOwned = MySQL.Sync.fetchScalar("SELECT citizenid FROM player_vehicles WHERE plate = ?", {plate})
    if isOwned ~= citizenid then
        return TriggerClientEvent("QBCore:Notify", src, "Vous ne possédez pas ce véhicule", "error")
    end
    if ped ~= driver then
        return TriggerClientEvent("QBCore:Notify", src, "Vous devez être conducteur", "error")
    end
    if passenger == 0 then
        return TriggerClientEvent("QBCore:Notify", src, "Pas de passager", "error")
    end
    local targetid = NetworkGetEntityOwner(passenger)
    local target = QBCore.Functions.GetPlayer(targetid)
    if not target then
        return TriggerClientEvent("QBCore:Notify", src, "Impossible de récupérer les infos passager", "error")
    end

    if sellAmount then
        if target.Functions.GetMoney("cash") > sellAmount then
            local targetcid = target.PlayerData.citizenid
            MySQL.Async.execute("UPDATE player_vehicles SET citizenid = ? WHERE plate = ?", {targetcid, plate})
            player.Functions.AddMoney("cash", sellAmount)
            TriggerClientEvent("QBCore:Notify", src, "Vous avez vendu votre véhicule pour $" .. comma_value(sellAmount), "success")
            target.Functions.RemoveMoney("cash", sellAmount)
            -- TriggerClientEvent('vehiclekeys:client:SetOwner', target.PlayerData.source, plate)
            TriggerClientEvent("QBCore:Notify", target.PlayerData.source, "Vous avez acheté le véhicule pour $" .. comma_value(sellAmount), "success")
        else
            TriggerClientEvent("QBCore:Notify", src, "Pas assez d'argent", "error")
        end
    else
        local targetcid = target.PlayerData.citizenid
        MySQL.Async.execute("UPDATE player_vehicles SET citizenid = ? WHERE plate = ?", {targetcid, plate})
        TriggerClientEvent("QBCore:Notify", src, "Vous avez donné votre véhicule", "success")
        -- TriggerClientEvent('vehiclekeys:client:SetOwner', target.PlayerData.source, plate)
        TriggerClientEvent("QBCore:Notify", target.PlayerData.source, "On vous a donné un véhicule", "success")
    end
end, "user")

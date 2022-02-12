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
    local money = pData.PlayerData.money["money"]
    local vehiclePrice = QBCore.Shared.Vehicles[vehicle]["price"]
    local plate = GeneratePlate()
    -- A mettre quand on achète le véhicule TODO en même temps que la vente JcJ chez la police
    -- os.date("%d/%m/%Y")
    local vehiclestock = MySQL.Sync.fetchAll("SELECT stock FROM concess_storage WHERE model = @model", {
        ["@model"] = vehicle,
    })
    if vehiclestock[1].stock > 0 then
        if money > vehiclePrice then
            MySQL.Async.insert(
                "INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state, boughttime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                {pData.PlayerData.license, cid, vehicle, GetHashKey(vehicle), "{}", plate, 0})
            MySQL.Async.execute("UPDATE concess_storage SET stock = stock - 1 WHERE model = ?", {vehicle})
            TriggerClientEvent("QBCore:Notify", src, "Merci pour votre achat!", "success")
            TriggerClientEvent("soz-concess:client:buyShowroomVehicle", src, vehicle, plate)
            pData.Functions.RemoveMoney("money", vehiclePrice, "vehicle-bought-in-showroom")
        else
            TriggerClientEvent("QBCore:Notify", src, "Pas assez d'argent", "error")
        end
    else
        TriggerClientEvent("QBCore:Notify", src, "Plus de stock", "error")
    end
end)

local QBCore = exports["qb-core"]:GetCoreObject()

local vehicles = {}
for k, voiture in pairs(QBCore.Shared.Vehicles) do
    vehicles[voiture["model"]] = voiture;
end

local function GetVehiclesByModels()
    return vehicles
end

exports("GetVehiclesByModels", GetVehiclesByModels)

local function GeneratePlate()
    local plate = QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(2)
    local result = MySQL.Sync.fetchScalar("SELECT plate FROM player_vehicles WHERE plate = ?", {plate})
    if result then
        return GeneratePlate()
    else
        return plate:upper()
    end
end

QBCore.Functions.CreateCallback("soz-concess:server:getstock", function(source, cb, RpcCategorie)
    local vehiclestock = MySQL.Sync.fetchAll("SELECT * FROM concess_storage WHERE category = ?", {RpcCategorie})
    if vehiclestock[1] then
        cb(vehiclestock)
    end
end)

RegisterNetEvent("soz-concess:server:buyShowroomVehicle", function(concess, vehicle, displayname)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local cid = pData.PlayerData.citizenid

    local qbVehicle = vehicles[vehicle]
    if qbVehicle == nil then
        exports["soz-monitor"]:Log("WARN", "Vehicle with model name '" .. vehicle .. "' is not in the config.")
    end
    local vehiclePrice = qbVehicle["price"]

    local plate = GeneratePlate()

    local vehiclestock = MySQL.Sync.fetchAll("SELECT stock FROM concess_storage WHERE model = @model", {
        ["@model"] = vehicle,
    })
    if vehiclestock[1].stock > 0 then
        if pData.Functions.RemoveMoney("money", vehiclePrice, "vehicle-bought-in-showroom") then
            local category = "car"
            local garage
            if concess == "pdm" or concess == "velo" then
                garage = "airportpublic"
                TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat! Le véhicule a été envoyé dans le Parking Public Sud")
            elseif concess == "air" then
                garage = "sandy_air"
                category = "air"
                TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat! L'hélicoptère a été envoyé au Parking Public en face")
            else
                garage = "haanparking"
                TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat! Le véhicule a été envoyé dans le Parking Public Nord")
            end

            MySQL.Async.insert(
                "INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, `condition`, plate, garage, category, state, life_counter, boughttime, parkingtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                {
                    pData.PlayerData.license,
                    cid,
                    vehicle,
                    GetHashKey(vehicle),
                    "{}",
                    "{}",
                    plate,
                    garage,
                    category,
                    1,
                    3,
                    os.time(),
                    os.time(),
                })
            MySQL.Async.execute("UPDATE concess_storage SET stock = stock - 1 WHERE model = ?", {vehicle})

            TriggerEvent("monitor:server:event", "vehicle_buy", {
                player_source = pData.PlayerData.source,
                buy_type = "player",
            }, {vehicle_id = vehicle, amount = vehiclePrice})
        else
            TriggerClientEvent("hud:client:DrawNotification", src, "Pas assez d'argent", "error")
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", src, "Plus de stock", "error")
    end
end)

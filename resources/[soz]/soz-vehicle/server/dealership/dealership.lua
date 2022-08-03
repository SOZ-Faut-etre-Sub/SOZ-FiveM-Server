local function GeneratePlate()
    local plate = QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(2)
    local result = MySQL.Sync.fetchScalar("SELECT plate FROM player_vehicles WHERE plate = ?", {plate})
    if result then
        return GeneratePlate()
    else
        return plate:upper()
    end
end

local function GetPriceOfVehicle(vehicle)
    return MySQL.Sync.fetchScalar("SELECT price FROM vehicles WHERE model = ?", {vehicle})
end
exports("GetPriceOfVehicle", GetPriceOfVehicle)
QBCore.Functions.CreateCallback("soz-vehicle:server:GetPriceOfVehicle", function(_, cb, vehicle)
    cb(GetPriceOfVehicle(vehicle))
end)

local function GetNameOfVehicle(vehicle)
    return MySQL.Sync.fetchScalar("SELECT name FROM vehicles WHERE model = ?", {vehicle})
end
QBCore.Functions.CreateCallback("soz-vehicle:server:GetNameOfVehicle", function(_, cb, vehicle)
    cb(GetNameOfVehicle(vehicle))
end)

local function GetAllVehicles()
    return MySQL.Sync.fetchAll("SELECT * FROM vehicles")
end
QBCore.Functions.CreateCallback("soz-vehicle:server:GetAllVehicles", function(_, cb)
    cb(GetAllVehicles())
end)

QBCore.Functions.CreateCallback("soz-vehicle:server:GetVehiclesOfDealership", function(_, cb, dealershipId)
    local models = MySQL.Sync.fetchAll(
                       "SELECT vehicles.model AS model, name, price, vehicles.category AS category, required_licence, size, job_name, stock FROM vehicles LEFT JOIN concess_storage ON vehicles.model = concess_storage.model WHERE dealership_id = ? AND stock IS NOT NULL;",
                       {dealershipId})
    cb(models)
end)

RegisterNetEvent("soz-concess:server:buyShowroomVehicle", function(dealership, vehicle)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local cid = pData.PlayerData.citizenid

    local price = GetPriceOfVehicle(vehicle)
    if price == nil then
        exports["soz-monitor"]:Log("WARN", "Vehicle with model name '" .. vehicle .. "' does not have a price for dealership '" .. dealership .. "'.")
        TriggerClientEvent("hud:client:DrawNotification", src, "Désolé je ne retrouve pas le prix de ce véhicule.", "error")
        return
    end

    local plate = GeneratePlate()

    local result = MySQL.Sync.fetchAll("SELECT stock FROM concess_storage WHERE model = @model", {["@model"] = vehicle})
    if result[1].stock > 0 then
        if pData.Functions.RemoveMoney("money", price, "vehicle-bought-in-showroom") then
            local category = "car"
            local garage
            if dealership == Config.DealershipTypes.Pdm or dealership == Config.DealershipTypes.Luxury or dealership == Config.DealershipTypes.Cycle then
                garage = "airportpublic"
                TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat! Le véhicule a été envoyé dans le Parking Public Sud")
            elseif dealership == Config.DealershipTypes.Air then
                garage = "sandy_air"
                category = "air"
                TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat! L'hélicoptère a été envoyé à l'héliport en face")
            elseif dealership == Config.DealershipTypes.Moto then
                garage = "haanparking"
                TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat! Le véhicule a été envoyé dans le Parking Public Nord")
            else
                garage = "marina_boat"
                category = "sea"
                TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat! Le véhicule a été envoyé au port en face.")
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
        TriggerClientEvent("hud:client:DrawNotification", src, "Le véhicule n'est plus en stock", "error")
    end
end)

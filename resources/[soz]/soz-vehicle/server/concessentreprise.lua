local QBCore = exports["qb-core"]:GetCoreObject()

local function GeneratePlateEntreprise(job)
    local plate = job .. tostring(math.random(01, 99))
    local result = MySQL.Sync.fetchScalar("SELECT plate FROM player_vehicles WHERE plate = ?", {plate})
    if result then
        return GeneratePlateEntreprise(job)
    else
        return plate:upper()
    end
end

QBCore.Functions.CreateCallback("soz-concessentreprise:server:getconcessmodels", function(source, cb)
    local listconcessmodels = MySQL.Sync.fetchAll("SELECT * FROM concess_entreprise")
    if listconcessmodels[1] then
        cb(listconcessmodels)
    end
end)

RegisterNetEvent("soz-concessentreprise:server:buyShowroomVehicle", function(vehicle, newlocation)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local cid = pData.PlayerData.citizenid
    local money = pData.PlayerData.money["money"]
    local plate = GeneratePlateEntreprise(vehicle.job)
    local depotprice  = math.ceil(vehicle.price / 100)
    if depotprice < 100 then
        depotprice = 100
    end
    if money > tonumber(vehicle.price) then
        MySQL.Async.insert(
            "INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state, depotprice, job, boughttime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            {
                pData.PlayerData.license,
                cid,
                vehicle.vehicle,
                GetHashKey(vehicle.vehicle),
                "{}",
                plate,
                0,
                depotprice,
                vehicle.job,
                os.time(),
            })
        TriggerClientEvent("hud:client:DrawNotification", src, "Merci pour votre achat!")
        TriggerClientEvent("soz-concessentreprise:client:buyShowroomVehicle", src, vehicle.vehicle, plate, newlocation)
        pData.Functions.RemoveMoney("money", vehicle.price, "vehicle-bought-in-showroom")
    else
        TriggerClientEvent("hud:client:DrawNotification", src, "Pas assez d'argent", "error")
    end
end)

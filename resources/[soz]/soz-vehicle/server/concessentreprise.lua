local QBCore = exports["qb-core"]:GetCoreObject()
local SozJobCore = exports["soz-jobs"]:GetCoreObject()

local Vehicles = {}

--- Main
MySQL.ready(function()
    MySQL.query("SELECT * FROM concess_entreprise", {}, function(result)
        for _, v in pairs(result or {}) do
            if Vehicles[v.job] == nil then
                Vehicles[v.job] = {}
            end

            Vehicles[v.job][v.vehicle] = {price = v.price}
        end
    end)
end)

--- Functions
local function GeneratePlateEntreprise(job)
    local plate = SozJobCore.Jobs[job].platePrefix .. " " .. tostring(math.random(111, 999))
    local result = MySQL.Sync.fetchScalar("SELECT plate FROM player_vehicles WHERE plate = ?", {plate})
    if result then
        return GeneratePlateEntreprise(job)
    else
        return plate:upper()
    end
end

QBCore.Functions.CreateCallback("soz-concessentreprise:server:getAvailableVehicles", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if not SozJobCore.Functions.HasPermission(Player.PlayerData.job.id, Player.PlayerData.job.id, Player.PlayerData.job.grade,
                                              SozJobCore.JobPermission.SocietyDealershipVehicle) then
        cb(nil)
        return
    end

    cb(Vehicles[Player.PlayerData.job.id] or {})
end)

RegisterNetEvent("soz-concessentreprise:server:buyShowroomVehicle", function(vehicle, newlocation)
    local Player = QBCore.Functions.GetPlayer(source)
    local plate = GeneratePlateEntreprise(Player.PlayerData.job.id)
    local depotprice = math.ceil(Vehicles[Player.PlayerData.job.id][vehicle].price / 100)
    if depotprice < 100 then
        depotprice = 100
    end

    local price = Vehicles[Player.PlayerData.job.id][vehicle].price

    if Player.Functions.RemoveMoney("money", price, "vehicle-bought-in-showroom") then
        MySQL.Async.insert(
            "INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, `condition`, plate, state, depotprice, job, boughttime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            {
                Player.PlayerData.license,
                Player.PlayerData.citizenid,
                vehicle,
                GetHashKey(vehicle),
                "{}",
                "{}",
                plate,
                0,
                depotprice,
                Player.PlayerData.job.id,
                os.time(),
            })

        TriggerEvent("monitor:server:event", "vehicle_buy", {player_source = Player.PlayerData.source, buy_type = "job"}, {
            vehicle_id = vehicle,
            amount = price,
        })

        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Merci pour votre achat!")
        TriggerClientEvent("soz-concessentreprise:client:buyShowroomVehicle", Player.PlayerData.source, vehicle, plate, newlocation)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Pas assez d'argent", "error")
    end
end)

QBCore.Functions.CreateCallback("soz-concessentreprise:server:getLiveryType", function(source, cb, vehicle)
    local Player = QBCore.Functions.GetPlayer(source)

    local result = MySQL.Sync.fetchAll("SELECT liverytype FROM concess_entreprise WHERE job = ? AND vehicle = ?", {
        Player.PlayerData.job.id,
        vehicle,
    })
    if result[1] then
        cb(result[1])
    end
end)

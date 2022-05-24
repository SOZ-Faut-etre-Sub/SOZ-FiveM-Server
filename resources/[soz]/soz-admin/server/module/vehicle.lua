local function GeneratePlate()
    local plate = QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(2)
    local result = MySQL.Sync.fetchScalar("SELECT plate FROM player_vehicles WHERE plate = ?", {plate})
    if result then
        return GeneratePlate()
    else
        return plate:upper()
    end
end

RegisterNetEvent("admin:vehicle:AddVehicle", function(model, vehicle, mods)
    if not SozAdmin.Functions.IsPlayerAdmin(source) then
        return
    end

    local Player = QBCore.Functions.GetPlayer(source)
    vehicle = NetworkGetEntityFromNetworkId(vehicle)

    MySQL.Async.insert([[
        INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, garage, state, boughttime)
        VALUES (:license, :citizenid, :vehicle, :hash, :mods, :plate, :garage, :state, :boughttime)
        ]], {
        ["license"] = Player.PlayerData.license,
        ["citizenid"] = Player.PlayerData.citizenid,
        ["vehicle"] = model,
        ["hash"] = GetHashKey(vehicle),
        ["mods"] = json.encode(mods),
        ["plate"] = GeneratePlate(),
        ["garage"] = "airportpublic",
        ["state"] = 1,
        ["boughttime"] = os.time(),
    })

    TriggerClientEvent("hud:client:DrawNotification", source, "Véhicule sauvegardé")
end)

RegisterNetEvent("inventory:client:openPlayerKeyInventory", function(keyType)
    if keyType == "vehicle" then
        local keys = QBCore.Functions.TriggerRpc("vehiclekeys:server:GetPlayerKeys")
        local vehicleItems = {}

        for _, plate in pairs(keys) do
            vehicleItems[#vehicleItems + 1] = {
                type = "key",
                name = "handcuffs_key", -- Used for icon
                label = "Véhicule " .. plate,
                plate = plate,
            }
        end

        SendNUIMessage({action = "openPlayerKeyInventory", keys = vehicleItems})
        SetNuiFocus(true, true)
    end
end)

RegisterNUICallback("player/giveKeyToTarget", function(data, cb)
    local hit, _, _, entityHit, entityType, _ = ScreenToWorld()
    SetNuiFocus(false, false)

    if hit == 1 and entityType == 1 then
        SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED", true)
        TriggerServerEvent("vehiclekeys:server:GiveVehicleKeys", data.plate, GetPlayerServerId(NetworkGetPlayerIndexFromPed(entityHit)))
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

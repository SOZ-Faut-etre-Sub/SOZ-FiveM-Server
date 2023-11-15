RegisterNetEvent("inventory:client:openPlayerKeyInventory", function(vehicleKeys)
    local playerKeys = {}

    for _, plate in pairs(vehicleKeys) do
        playerKeys[#playerKeys + 1] = {
            type = "key",
            name = "vehicle_key", -- Used for icon
            label = "Véhicule " .. plate,
            target = "vehicle_key",
            plate = plate,
        }
    end

    local apartmentKeys = QBCore.Functions.TriggerRpc("housing:server:GetPlayerAccess")
    for propertyId, properties in pairs(apartmentKeys) do
        for apartmentId, apartment in pairs(properties) do
            playerKeys[#playerKeys + 1] = {
                type = "key",
                name = "apartment_key", -- Used for icon
                label = "Appartement " .. apartment.label,
                target = "apartment_access",
                propertyId = propertyId,
                apartmentId = apartmentId,
            }
        end
    end

    SendNUIMessage({action = "openPlayerKeyInventory", keys = playerKeys})
    SetNuiFocus(true, true)
end)

RegisterNUICallback("player/openPlayerKeyInventory", function(data, cb)
    TriggerServerEvent("soz-core:server:vehicle:open-keys")
    cb(true)
end)

RegisterNUICallback("player/giveKeyToTarget", function(data, cb)
    local hit, _, _, entityHit, entityType, _ = ScreenToWorld()

    if hit == 1 and entityType == 1 then
        local playerHit = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entityHit))

        if data.target == "vehicle_key" then
            TriggerServerEvent("soz-core:server:vehicle:give-key", data.plate, playerHit)
        elseif data.target == "apartment_access" then
            TriggerServerEvent("housing:server:GiveTemporaryAccess", data.propertyId, data.apartmentId, playerHit)
        end
    else
        exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

RegisterNUICallback("player/giveAllVehicleKeysToTarget", function(data, cb)
    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.0 then
        for _, key in pairs(data) do
            if key.target == "vehicle_key" then
                TriggerServerEvent("soz-core:server:vehicle:give-key", key.plate, GetPlayerServerId(player))
            end
        end
    else
        exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

RegisterNUICallback("player/giveAllAppartmentKeysToTarget", function(data, cb)
    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.0 then
        for _, key in pairs(data) do
            if key.target == "apartment_access" then
                TriggerServerEvent("housing:server:GiveTemporaryAccess", key.propertyId, key.apartmentId, GetPlayerServerId(player))
            end
        end
    else
        exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

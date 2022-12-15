RegisterNetEvent("inventory:client:openPlayerKeyInventory", function(vehicleKeys)
    local playerKeys = {}

    for _, plate in pairs(vehicleKeys) do
        playerKeys[#playerKeys + 1] = {
            type = "key",
            name = "handcuffs_key", -- Used for icon
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
                name = "handcuffs_key", -- Used for icon
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

RegisterNUICallback("player/giveKeyToTarget", function(data, cb)
    local hit, _, _, entityHit, entityType, _ = ScreenToWorld()
    SetNuiFocus(false, false)

    print(data)

    if hit == 1 and entityType == 1 then
        local playerHit = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entityHit))
        TriggerEvent("inventory:client:StoreWeapon")

        if data.target == "vehicle_key" then
            TriggerServerEvent("soz-core:server:vehicle:give-key", data.plate, playerHit)
        elseif data.target == "apartment_access" then
            TriggerServerEvent("housing:server:GiveTemporaryAccess", data.propertyId, data.apartmentId, playerHit)
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

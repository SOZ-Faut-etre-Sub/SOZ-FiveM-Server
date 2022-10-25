local GarageTypes


AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    CreateThread(function()
        -- Generate zone and place for player's house
        TriggerEvent("soz-garage:client:GenerateHousingZoneAndPlace")
    end)
end)

AddEventHandler("soz-garage:client:GenerateHousingZoneAndPlace", function()
    local houses = QBCore.Functions.TriggerRpc("housing:server:GetPlayerProperties")
    if not houses then
        return
    end

    for _, house in pairs(houses) do
        local gData = house.garage_zone

        if gData then
            local zone = BoxZone:Create(vector3(gData.x, gData.y, gData.z), 8.0, 6.0, {
                name = "soz-garage:" .. "property_" .. house.identifier,
                heading = gData.heading,
                minZ = gData.z - 2.0,
                maxZ = gData.z + 2.0,
                data = {indexGarage = "property_" .. house.identifier},
            })

            GarageTypes.housing.zones = {["property_" .. house.identifier] = zone}
            GarageTypes.housing.places = {["property_" .. house.identifier .. "p1"] = zone}
        end
    end
end)


RegisterNetEvent("soz-garage:client:UpdateVehicleMods", function(vehNetId, mods)
    QBCore.Functions.SetVehicleProperties(NetToVeh(vehNetId), mods)
end)

RegisterNetEvent("soz-garage:client:PutInDepot", function(entity)
    local plate = QBCore.Functions.GetPlate(entity)
    local isVehicleOwned = QBCore.Functions.TriggerRpc("soz-garage:server:IsVehicleOwned", plate)

    if isVehicleOwned then
        local vehExtraData = GetVehicleClientData(entity)

        if not CanVehicleBeParkedInGarage(entity, "fourriere", "depot", plate) then
            return
        end

        -- Set body damage from client, as it always return 1000 on server
        SetEntityAsMissionEntity(veh, true, true)

        QBCore.Functions.TriggerCallback("soz-garage:server:ParkVehicleInDepot", function(success)
            if success then
                exports["soz-hud"]:DrawNotification("Le véhicule a été mis en fourrière")
            else
                exports["soz-hud"]:DrawNotification("Impossible de mettre le véhicule en fourrière", "error")
            end
        end, "fourriere", NetworkGetNetworkIdFromEntity(entity), vehExtraData)

        return
    end

    -- Not owned only despawn
    TriggerServerEvent("soz-garage:server:DespawnVehicle", VehToNet(entity))
    exports["soz-hud"]:DrawNotification("Le véhicule a été mis en fourrière")
end)

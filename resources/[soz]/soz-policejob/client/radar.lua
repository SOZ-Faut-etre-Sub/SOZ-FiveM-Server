CreateThread(function()
    for radarID, radar in pairs(Config.Radars) do
        local SpeedZone = CircleZone:Create(radar.zone, radar.zoneRadius, {useZ = true})

        SpeedZone:onPlayerInOut(function(isInside)
            if isInside then
                local ped = PlayerPedId()
                local vehicle = GetVehiclePedIsIn(ped, false)

                if vehicle then
                    local coords = GetEntityCoords(vehicle, false)
                    local streetA, _ = GetStreetNameAtCoord(coords.x, coords.y, coords.z)

                    TriggerServerEvent("police:client:radar:trigger", radarID, VehToNet(vehicle), GetVehicleClass(vehicle), GetStreetNameFromHashKey(streetA))
                end
            end
        end)
    end
end)

RegisterNetEvent("police:client:radar:flashed", function()
    StartScreenEffect("RaceTurbo", 300, false)
end)

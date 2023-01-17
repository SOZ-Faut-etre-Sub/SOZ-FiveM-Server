CreateThread(function()
    SetMapZoomDataLevel(0, 0.96, 0.9, 0.08, 0.0, 0.0)
    SetMapZoomDataLevel(1, 1.6, 0.9, 0.08, 0.0, 0.0)
    SetMapZoomDataLevel(2, 8.6, 0.9, 0.08, 0.0, 0.0)
    SetMapZoomDataLevel(3, 12.3, 0.9, 0.08, 0.0, 0.0)
    SetMapZoomDataLevel(4, 22.3, 0.9, 0.08, 0.0, 0.0)
end)

CreateThread(function()
    while true do
        if IsPedOnFoot(PlayerPedId()) then
            SetRadarZoom(1100)
        elseif IsPedInAnyVehicle(PlayerPedId(), true) then
            SetRadarZoom(1100)
        end
        Wait(1)
    end
end)

CreateThread(function()
    local lastZone = ""
    while true do
        local coords = GetEntityCoords(PlayerPedId())
        local currentZone = GetNameOfZone(coords)

        if (currentZone == "ARMYB" or currentZone == "HUMLAB") and lastZone ~= currentZone then
            TriggerServerEvent("core:server:zoneIntrusion", currentZone)
        end
        lastZone = currentZone

        Wait(2000)
    end
end)

local surgery = BoxZone:Create(vector3(334.97, -1446.74, 32.51), 8.4, 6.2, {
    name = "surgery",
    heading = 320,
    debugPoly = false,
    minZ = 31.51,
    maxZ = 34.51,
})

local hopital = BoxZone:Create(vector3(346.73, -1413.53, 32.26), 84.4, 92.6, {
    name = "surgery",
    heading = 320,
    debugPoly = false,
    minZ = 28.46,
    maxZ = 39.86,
})

InsideSurgery = false
InsideHopital = false

Citizen.CreateThread(function()
    while true do
        local plyPed = PlayerPedId()
        local coord = GetEntityCoords(plyPed)
        InsideSurgery = surgery:isPointInside(coord)
        InsideHopital = hopital:isPointInside(coord)
        Citizen.Wait(2500)
    end
end)

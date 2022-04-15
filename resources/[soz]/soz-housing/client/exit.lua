Citizen.CreateThread(function()
    for item, zone in pairs(Config.exit) do
        exports["qb-target"]:AddBoxZone(zone.name, vector3(zone.x, zone.y, zone.z), zone.sx, zone.sy, {
            name = zone.name,
            heading = zone.heading,
            minZ = zone.minZ,
            maxZ = zone.maxZ,
            debugPoly = true,
        }, {
            options = {
                {
                    label = "sortir",
                    icon = "c:housing/entrer.png",
                    canInteract = function()
                        return IsInside
                    end,
                    action = function()
                        TriggerEvent("soz-housing:client:Exit")
                    end,
                },
            },
            distance = 2.5,
        })
    end
end)

RegisterNetEvent("soz-housing:client:Exit")
AddEventHandler("soz-housing:client:Exit", function()
    player = PlayerPedId()
    SetPedCoordsKeepVehicle(player, LastLocation)
    IsInside = false
end)
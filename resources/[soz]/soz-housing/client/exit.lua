RegisterNetEvent("soz-housing:client:SetExit")
AddEventHandler("soz-housing:client:SetExit", function(GlobalZone)
    Citizen.CreateThread(function()
        for item, zone in pairs(GlobalZone) do
            local exit = json.decode(zone.exit_zone)
            exports["qb-target"]:AddBoxZone(zone.identifier .. "_exit", vector3(exit["x"], exit["y"], exit["z"]), exit["sx"], exit["sy"],
                                            {
                name = zone.identifier .. "_exit",
                heading = exit["heading"],
                minZ = exit["minZ"],
                maxZ = exit["maxZ"],
                debugPoly = false,
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
end)

RegisterNetEvent("soz-housing:client:Exit")
AddEventHandler("soz-housing:client:Exit", function()
    player = PlayerPedId()
    SetPedCoordsKeepVehicle(player, LastLocation)
    IsInside = false
end)

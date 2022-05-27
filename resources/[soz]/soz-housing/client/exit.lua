RegisterNetEvent("soz-housing:client:SetExit")
AddEventHandler("soz-housing:client:SetExit", function(GlobalZone)
    Citizen.CreateThread(function()
        for _, zone in pairs(GlobalZone) do
            -- Only add exit zone for correctly configured house
            if zone.identifier and zone.exit_zone then
                local exit = json.decode(zone.exit_zone)
                exports["qb-target"]:AddBoxZone(zone.identifier .. "_exit", vector3(exit["x"], exit["y"], exit["z"]), exit["sx"], exit["sy"], {
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
        end
    end)
end)

RegisterNetEvent("soz-housing:client:Exit")
AddEventHandler("soz-housing:client:Exit", function()
    QBCore.Functions.Progressbar("exit", "Ferme la porte", 1000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@narcotics@trash", anim = "drop_front", flags = 16}, {}, {}, function() -- Done
        SetPedCoordsKeepVehicle(PlayerPedId(), LastLocation)
    end, function() -- Cancel
    end)
    IsInside = false
end)

Citizen.CreateThread(function ()
    exports["qb-target"]:AddBoxZone("stonk:duty", vector2(-18.74, -707.44), 0.2, 0.5, {
        heading = 200.0,
        minZ = 45.9,
        maxZ = 46.45,
    }, {
        options = {
            {
                icon = "fas fa-sign-in-alt",
                label = "Prise de service",
                type = "server",
                event = "QBCore:ToggleDuty",
                canInteract = function ()
                    return not PlayerData.job.onduty
                end,
            },
            {
                icon = "fas fa-sign-out-alt",
                label = "Fin de service",
                type = "server",
                event = "QBCore:ToggleDuty",
                canInteract = function ()
                    return PlayerData.job.onduty
                end,
            },
        }
    })
end)

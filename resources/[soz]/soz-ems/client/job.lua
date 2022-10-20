EmsJob = {}

exports["qb-target"]:AddBoxZone("duty_lsmc", vector3(356.62, -1417.61, 32.51), 0.65, 0.5,
                                {name = "duty_lsmc", heading = 325, minZ = 32.41, maxZ = 32.61, debugPoly = false}, {
    options = {
        {
            type = "server",
            event = "QBCore:ToggleDuty",
            icon = "fas fa-sign-in-alt",
            label = "Prendre son service",
            canInteract = function()
                return not PlayerData.job.onduty
            end,
            job = "lsmc",
        },
        {
            type = "server",
            event = "QBCore:ToggleDuty",
            icon = "fas fa-sign-in-alt",
            label = "Finir son service",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            job = "lsmc",
        },
    },
    distance = 2.5,
})

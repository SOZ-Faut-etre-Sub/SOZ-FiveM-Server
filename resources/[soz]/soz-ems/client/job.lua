onDuty = true

exports["qb-target"]:AddBoxZone("duty_lsmc", vector3(356.62, -1417.61, 32.51), 0.65, 0.5, {
    name = "duty_lsmc",
    heading = 325,
    minZ = 32.41,
    maxZ = 32.61,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "lsmc:duty",
            icon = "fas fa-sign-in-alt",
            label = "Prendre son service",
            canInteract= function()
                return onDuty == false
            end,
            job = "lsmc",
        },
        {
            type = "client",
            event = "lsmc:duty",
            icon = "fas fa-sign-in-alt",
            label = "Finir son service",
            canInteract= function()
                return onDuty == true
            end,
            job = "lsmc",
        },
    },
    distance = 2.5,
})

RegisterNetEvent("lsmc:duty")
AddEventHandler("lsmc:duty", function()
    onDuty = not onDuty
    if onDuty then 
        exports["soz-hud"]:DrawNotification("Vous avez pris votre service!")
    else
        exports["soz-hud"]:DrawNotification("Vous avez fini votre service!")
    end
end)
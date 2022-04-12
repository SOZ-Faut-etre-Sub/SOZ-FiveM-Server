local lastSocietyCall = GetGameTimer()

CreateThread(function()
    local function callSociety(number)
        return {
            {
                label = "Biper",
                icon = "c:jobs/biper.png",
                event = "jobs:client:callSociety",
                canInteract = function()
                    return lastSocietyCall + 15000 < GetGameTimer()
                end,
                number = number,
            },
        }
    end

    exports["qb-target"]:AddBoxZone("bell:lspd", vector3(633.66, 7.62, 82.63), 0.2, 0.4, {
        name = "bell:lspd",
        heading = 326,
        minZ = 82.5,
        maxZ = 83.0,
    }, {options = callSociety("555-LSPD"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:bcso", vector3(1853.08, 3687.48, 34.27), 0.4, 0.2, {
        name = "bell:bcso",
        heading = 292,
        minZ = 34.0,
        maxZ = 34.5,
    }, {options = callSociety("555-BCSO"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:garbage", vector3(-616.73, -1621.55, 33.01), 0.25, 0.35,
                                    {name = "bell:garbage", heading = 355, minZ = 33.0, maxZ = 33.1}, {
        options = callSociety("555-ROGERS"),
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("bell:news", vector3(-586.9, -933.61, 23.82), 0.25, 0.35, {
        name = "bell:news",
        heading = 33,
        minZ = 24.0,
        maxZ = 24.10,
    }, {options = callSociety("555-NEWS"), distance = 2.5})
end)

RegisterNetEvent("jobs:client:callSociety", function(data)
    lastSocietyCall = GetGameTimer()
    TriggerServerEvent("npwd:sendSocietyMessage", "npwd:sendSocietyMessage:" .. QBCore.Shared.UuidV4(),
                       {
        anonymous = false,
        number = data.number,
        message = "Une personne vous demande à l'accueil",
        position = true,
    })
end)

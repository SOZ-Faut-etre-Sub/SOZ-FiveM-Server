local lastSocietyCall = GetGameTimer()

CreateThread(function()
    local function callSociety(number)
        return {
            {
                label = "Biper",
                icon = "c:jobs/biper.png",
                event = "jobs:client:callSociety",
                blackoutGlobal = true,
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
        options = callSociety("555-BLUEBIRD"),
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("bell:news", vector3(-586.9, -933.61, 23.82), 0.25, 0.35, {
        name = "bell:news",
        heading = 33,
        minZ = 24.0,
        maxZ = 24.10,
    }, {options = callSociety("555-NEWS"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:food", vector2(-1884.4, 2063.0), 0.5, 0.5, {
        name = "bell:food",
        heading = 159.0,
        minZ = 141.0,
        maxZ = 141.25,
    }, {options = callSociety("555-MARIUS"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:mtp", vector3(-245.88, 6072.43, 32.33), 0.25, 0.35, {
        name = "bell:mtp",
        heading = 76.0,
        minZ = 32.3,
        maxZ = 32.6,
    }, {options = callSociety("555-MTP"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:lsmc", vector3(358.71, -1415.06, 32.51), 0.6, 0.4, {
        name = "bell:LSMC",
        heading = 0,
        minZ = 32.41,
        maxZ = 32.61,
    }, {options = callSociety("555-LSMC"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:stonk", vector3(7.18, -692.90, 46.22), 0.4, 0.4, {
        name = "bell:STONK",
        heading = 0,
        minZ = 46.12,
        maxZ = 46.32,
    }, {options = callSociety("555-STONK"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:upw", vector3(619.76, 2728.02, 41.86), 0.2, 0.3, {
        name = "bell:upw",
        heading = 4,
        minZ = 41.71,
        maxZ = 41.91,
    }, {options = callSociety("555-UPW"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:pawl", vector3(-540.28, 5299.97, 76.37), 0.2, 0.3, {
        name = "bell:pawl",
        heading = 326,
        minZ = 76.07,
        maxZ = 76.27,
    }, {options = callSociety("555-PAWL"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bell:baun:bahama", vector3(-1393.46, -600.43, 30.32), 0.35, 0.25,
                                    {name = "bell:baun:bahama", heading = 327, minZ = 30.32, maxZ = 30.47}, {
        options = callSociety("555-BAUN"),
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("bell:baun:unicorn", vector3(130.04, -1287.28, 29.28), 0.25, 0.35,
                                    {name = "bell:baun:unicorn", heading = 302, minZ = 29.28, maxZ = 29.43}, {
        options = callSociety("555-BAUN"),
        distance = 2.5,
    })
end)

RegisterNetEvent("jobs:client:callSociety", function(data)
    lastSocietyCall = GetGameTimer()

    QBCore.Functions.RequestAnimDict("mp_doorbell")
    TaskPlayAnim(PlayerPedId(), "mp_doorbell", "ring_bell_a", 8.0, -8.0, 3000, 48, 0, false, false, false)

    TriggerServerEvent("phone:sendSocietyMessage", "phone:sendSocietyMessage:" .. QBCore.Shared.UuidV4(),
                       {
        anonymous = false,
        number = data.number,
        message = "Une personne vous demande à l'accueil",
        position = true,
    })
end)

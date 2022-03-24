local lastSocietyCall = GetGameTimer()

CreateThread(function()
    local function callSociety(number)
        return {
            {
                label = "Appeler une personne de la société",
                icon = "fas fa-phone-alt",
                event = "jobs:client:callSociety",
                canInteract = function()
                    return lastSocietyCall + 15000 < GetGameTimer()
                end,
                number = number,
            },
        }
    end

    exports["qb-target"]:AddBoxZone("bell:bcso", vector3(1853.08, 3687.48, 34.27), 0.4, 0.2, {
        name = "bell:bcso",
        heading = 292,
        minZ = 34,
        maxZ = 34.5,
    }, {options = callSociety("555-BCSO"), distance = 2.5})

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

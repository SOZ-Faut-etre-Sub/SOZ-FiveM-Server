local surgery = BoxZone:Create(vector3(334.97, -1446.74, 32.51), 8.4, 6.2, {
    name = "surgery",
    heading = 320,
    debugPoly = false,
    minZ = 31.51,
    maxZ = 34.51,
})

local InsideSurgery = false
Citizen.CreateThread(function()
    while true do
        local plyPed = PlayerPedId()
	    local coord = GetEntityCoords(plyPed)
	    InsideSurgery = surgery:isPointInside(coord)
	    Citizen.Wait(2500)
    end
end)    

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Enlever un Poumon",
                icon = "fas fa-file-invoice-dollar",
                job = {["lsmc"] = 0},
                canInteract = function()
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery
                end,
                action = function(entity)
                    TriggerEvent("animations:client:EmoteCommandStart", {"mechanic"})
                    QBCore.Functions.Progressbar("Soigner", "Enlever un Poumon..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {}, {}, {}, function()
                        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
                        SetEntityHealth(entity, GetEntityHealth(entity) + 25)
                    end)
                end,
            },
            {
                label = "Enlever un Rein",
                icon = "fas fa-file-invoice-dollar",
                job = {["lsmc"] = 0},
                canInteract = function()
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery
                end,
                action = function(entity)
                    TriggerEvent("animations:client:EmoteCommandStart", {"mechanic"})
                    QBCore.Functions.Progressbar("Soigner", "Enlever un Rein..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {}, {}, {}, function()
                        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
                        SetEntityHealth(entity, GetEntityHealth(entity) + 25)
                    end)
            },
            {
                label = "Enlever le Foie",
                icon = "fas fa-file-invoice-dollar",
                job = {["lsmc"] = 0},
                canInteract = function()
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery
                end,
                action = function(entity)
                    TriggerEvent("animations:client:EmoteCommandStart", {"mechanic"})
                    QBCore.Functions.Progressbar("Soigner", "Enlever le Foie..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {}, {}, {}, function()
                        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
                        SetEntityHealth(entity, GetEntityHealth(entity) + 25)
                    end)
            },
        },
        distance = 2.5,
    })
end)
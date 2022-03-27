QBCore = exports["qb-core"]:GetCoreObject()

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Soigner",
                icon = "fas fa-heart",
                job = {["lsmc"] = 0},
                canInteract = function()
                    return onDuty
                end,
                action = function(entity)
                    TriggerEvent("animations:client:EmoteCommandStart", {"medic"})
                    QBCore.Functions.Progressbar("Soigner", "Appliquer un bandage..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {}, {}, {}, function()
                        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
                        TriggerServerEvent("lsmc:server:remove", "firstaid")
                        SetEntityHealth(entity, GetEntityHealth(entity) + 25)
                    end)
                end,
                item = "firstaid",
            },
            {
                label = "Réanimer",
                icon = "fas fa-bolt",
                job = {["lsmc"] = 0},
                canInteract = function(entity)
                    return onDuty and IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
                action = function(entity)
                    TriggerEvent("animations:client:EmoteCommandStart", {"cpr"})
                    QBCore.Functions.Progressbar("réanimer", "Vous réanimez la personne..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {}, {}, {}, function()
                        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
                        TriggerServerEvent("lsmc:server:remove", "défibrilateur")
                        ReviveId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:revive", ReviveId)
                    end)
                end,
                item = "défibrilateur",
            },
        },
        distance = 1.5,
    })
end)

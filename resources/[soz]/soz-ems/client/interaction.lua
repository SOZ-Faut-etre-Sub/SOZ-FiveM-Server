CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Soigner",
                color = "lsmc",
                icon = "c:ems/heal.png",
                job = "lsmc",
                canInteract = function(entity)
                    local target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    return PlayerData.job.onduty and not Player(target).state.isdead
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Soigner", "Appliquer un bandage..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {task = "CODE_HUMAN_MEDIC_TEND_TO_DEAD"}, {}, {}, function()
                        TriggerServerEvent("lsmc:server:remove", "firstaid")
                        TriggerServerEvent("monitor:server:event", "job_lsmc_heal", {}, {
                            amount = 25,
                            before_health = GetEntityHealth(entity),
                            after_health = GetEntityHealth(entity) + 25,
                            target_source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                            position = GetEntityCoords(entity),
                        }, true)
                        TriggerServerEvent("lsmc:server:heal", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
                    end)
                end,
                item = "firstaid",
            },
            {
                label = "Réanimer",
                color = "lsmc",
                icon = "c:ems/revive.png",
                job = "lsmc",
                canInteract = function(entity)
                    local target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    return PlayerData.job.onduty and Player(target).state.isdead
                end,
                action = function(entity)
                    TriggerEvent("soz-core:lsmc:reanimate", entity)
                    TriggerServerEvent("lsmc:server:remove", "bloodbag")
                    TriggerServerEvent("lsmc:server:add", "used_bloodbag")
                    TriggerServerEvent("monitor:server:event", "job_lsmc_revive_bloodbag", {},
                                       {
                        target_source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        position = GetEntityCoords(entity),
                    }, true)
                end,
                item = "bloodbag",
            },
            {
                label = "Utiliser Défibrilateur",
                color = "lsmc",
                icon = "c:ems/revive.png",
                canInteract = function(entity)
                    local target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    return Player(target).state.isdead
                end,
                action = function(entity)
                    TriggerEvent("soz-core:lsmc:reanimate", entity)
                    TriggerServerEvent("lsmc:server:remove", "defibrillator")
                    TriggerServerEvent("monitor:server:event", "job_lsmc_revive_defibrillator", {},
                                       {
                        target_source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        position = GetEntityCoords(entity),
                    }, true)
                end,
                item = "defibrillator",
            },
            {
                label = "Prise de sang",
                color = "lsmc",
                icon = "c:ems/take_blood.png",
                job = "lsmc",
                canInteract = function(entity)
                    local target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    return PlayerData.job.onduty and not Player(target).state.isdead
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Take_Blood", "Vous faites une prise de sang...", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {task = "CODE_HUMAN_MEDIC_TEND_TO_DEAD"}, {}, {}, function()
                        TriggerServerEvent("lsmc:server:remove", "empty_bloodbag")
                        TriggerServerEvent("lsmc:server:add", "bloodbag")
                        TriggerServerEvent("lsmc:server:GiveBlood", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
                        TriggerServerEvent("monitor:server:event", "job_lsmc_bloodbag", {},
                                           {
                            target_source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                            position = GetEntityCoords(entity),
                        }, true)
                    end)
                end,
                item = "empty_bloodbag",
            },
        },
        distance = 2.5,
    })
end)

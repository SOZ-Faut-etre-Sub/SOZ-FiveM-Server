CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facture",
                color = "lsmc",
                icon = "fas fa-file-invoice-dollar",
                event = "lsmc:client:InvoicePlayer",
                job = "lsmc",
                canInteract = function(entity)
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
            },
            {
                label = "Soigner",
                color = "lsmc",
                icon = "c:ems/heal.png",
                job = "lsmc",
                canInteract = function(entity)
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3) and not InsideSurgery
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
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "dead", "dead_a", 3) and not InsideSurgery
                end,
                action = function(entity)
                    TriggerServerEvent("lsmc:server:GetMort", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
                    QBCore.Functions.Progressbar("Revive", "Vous réanimez la personne..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "mini@cpr@char_a@cpr_str", anim = "cpr_pumpchest"}, {}, {}, function()
                        TriggerServerEvent("lsmc:server:remove", "bloodbag")
                        TriggerServerEvent("lsmc:server:revive", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
                        TriggerServerEvent("monitor:server:event", "job_lsmc_revive_bloodbag", {},
                                           {
                            target_source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                            position = GetEntityCoords(entity),
                        }, true)
                    end)
                end,
                item = "bloodbag",
            },
            {
                label = "Réanimer",
                color = "lsmc",
                icon = "c:ems/revive.png",
                canInteract = function(entity)
                    return IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Revive", "Vous réanimez la personne..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "mini@cpr@char_a@cpr_str", anim = "cpr_pumpchest"}, {}, {}, function()
                        TriggerServerEvent("lsmc:server:remove", "defibrillator")
                        TriggerServerEvent("lsmc:server:revive", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
                        TriggerServerEvent("monitor:server:event", "job_lsmc_revive_defibrillator", {},
                                           {
                            target_source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                            position = GetEntityCoords(entity),
                        }, true)
                    end)
                end,
                item = "defibrillator",
            },
            {
                label = "Prise de sang",
                color = "lsmc",
                icon = "c:ems/take_blood.png",
                job = "lsmc",
                canInteract = function(entity)
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3) and not InsideSurgery
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
            {
                label = "Itt",
                color = "lsmc",
                icon = "c:pole/end.png",
                job = "lsmc",
                canInteract = function(entity)
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3) and not InsideSurgery and InsideHopital
                end,
                action = function(entity)
                    TriggerServerEvent("lsmc:server:SetItt", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
                end,
            },
        },
        distance = 2.5,
    })
end)

RegisterNetEvent("lsmc:client:InvoicePlayer", function(data)
    EmsJob.Functions.Menu.GenerateInvoiceMenu(PlayerData.job.id, data.entity)
end)

QBCore = exports["qb-core"]:GetCoreObject()

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facture",
                icon = "fas fa-file-invoice-dollar",
                event = "lsmc:client:InvoicePlayer",
                job = {["lsmc"] = 0},
                canInteract = function()
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
            },
            {
                label = "Soigner",
                icon = "fas fa-heart",
                job = {["lsmc"] = 0},
                canInteract = function()
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
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
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
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
                        TriggerServerEvent("lsmc:server:remove", "bloodbag")
                        ReviveId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:revive", ReviveId)
                    end)
                end,
                item = "bloodbag",
            },
            {
                label = "Réanimer",
                icon = "fas fa-bolt",
                canInteract = function(entity)
                    return IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
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
                        TriggerServerEvent("lsmc:server:remove", "bloodbag")
                        ReviveId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:revive", ReviveId)
                    end)
                end,
                item = "defibrillator",
            },
            {
                label = "Prise de sang",
                icon = "fas fa-bolt",
                job = {["lsmc"] = 0},
                canInteract = function(entity)
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
                action = function(entity)
                    TriggerEvent("animations:client:EmoteCommandStart", {"medic"})
                    QBCore.Functions.Progressbar("réanimer", "Vous faites une prise de sang...", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {}, {}, {}, function()
                        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
                        TriggerServerEvent("lsmc:server:remove", "empty_bloodbag")
                        TriggerServerEvent("lsmc:server:add", "bloodbag")
                        PlayerId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:GiveBlood", PlayerId)
                    end)
                end,
                item = "empty_bloodbag",
            },
            {
                label = "Soigner la grippe",
                icon = "fas fa-bolt",
                job = {["lsmc"] = 0},
                canInteract = function(entity)
                    return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
                action = function(entity)
                    TriggerEvent("animations:client:EmoteCommandStart", {"medic"})
                    QBCore.Functions.Progressbar("antipyrétique", "Vous administrer des antipyrétiques...", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {}, {}, {}, function()
                        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
                        TriggerServerEvent("lsmc:server:remove", "antipyretic")
                        PlayerId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:SetOrgane", PlayerId, "grippe", false)
                    end)
                end,
                item = "empty_bloodbag",
            },
        },
        distance = 2.5,
    })
end)

RegisterNetEvent("lsmc:client:InvoicePlayer", function(data)
    EmsJob.Functions.Menu.GenerateInvoiceMenu(PlayerData.job.id, data.entity)
end)

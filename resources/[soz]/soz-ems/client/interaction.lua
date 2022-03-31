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
                        TriggerServerEvent("lsmc:server:remove", "trousse_de_secours")
                        SetEntityHealth(entity, GetEntityHealth(entity) + 25)
                    end)
                end,
                item = "trousse_de_secours",
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
                        TriggerServerEvent("lsmc:server:remove", "poche_de_sang")
                        ReviveId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:revive", ReviveId)
                    end)
                end,
                item = "poche_de_sang",
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
                        TriggerServerEvent("lsmc:server:remove", "poche_vide")
                        TriggerServerEvent("lsmc:server:add", "poche_de_sang")
                        PlayerId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:GiveBlood")
                    end)
                end,
                item = "poche_vide",
            },
        },
        distance = 2.5,
    })
end)

RegisterNetEvent("lsmc:client:InvoicePlayer", function(data)
    EmsJob.Functions.Menu.GenerateInvoiceMenu(PlayerData.job.id, data.entity)
end)

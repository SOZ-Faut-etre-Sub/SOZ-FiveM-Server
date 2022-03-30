QBCore = exports["qb-core"]:GetCoreObject()

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facture",
                icon = "fas fa-file-invoice-dollar",
                event = "lsmc:client:InvoicePlayer",
                job = {["lsmc"] = 0},
            },
            {
                label = "Soigner",
                icon = "fas fa-heart",
                job = {["lsmc"] = 0},
                canInteract = function()
                    return PlayerData.job.onduty
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
                        TriggerServerEvent("lsmc:server:remove", "défibrilateur")
                        ReviveId = GetPlayerServerId(entity)
                        TriggerServerEvent("lsmc:server:revive", ReviveId)
                    end)
                end,
                item = "medkit",
            },
        },
        distance = 1.5,
    })
end)

RegisterNetEvent("lsmc:client:InvoicePlayer", function(data)
    EmsJob.Functions.Menu.GenerateInvoiceMenu(PlayerData.job.id, data.entity)
end)

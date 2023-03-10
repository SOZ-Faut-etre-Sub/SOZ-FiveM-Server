CreateThread(function()
    exports["qb-target"]:AddBoxZone("lspd:moneychecker", vector3(586.82, 13.41, 76.63), 2.4, 0.8,
                                    {name = "lspd:moneychecker", heading = 350, minZ = 76.63, maxZ = 77.63}, {
        options = {
            {
                label = "Analyser",
                color = "lspd",
                icon = "c:police/fouiller.png",
                event = "police:client:MoneyChecker",
                canInteract = function(player)
                    local player, distance = QBCore.Functions.GetClosestPlayer()

                    return PlayerData.job.onduty and player ~= -1 and distance <= 2.0
                end,
                job = "lspd",
                blackoutGlobal = true,
                blackoutJob = "lspd",
            },
        },
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("bcso:moneychecker", vector3(1857.69, 3687.39, 30.27), 2.4, 0.8,
                                    {name = "bcso:moneychecker", heading = 210, minZ = 29.27, maxZ = 32.27}, {
        options = {
            {
                label = "Analyser",
                color = "bcso",
                icon = "c:police/fouiller.png",
                event = "police:client:MoneyChecker",
                canInteract = function(player)
                    local player, distance = QBCore.Functions.GetClosestPlayer()

                    return PlayerData.job.onduty and player ~= -1 and distance <= 2.0
                end,
                job = "bcso",
                blackoutGlobal = true,
                blackoutJob = "bcso",
            },
        },
        distance = 2.5,
    })
end)

RegisterNetEvent("police:client:MoneyChecker", function()
    local player, distance = QBCore.Functions.GetClosestPlayer()

    if player ~= -1 and distance <= 2.0 then
        QBCore.Functions.TriggerCallback("police:getOtherPlayerData", function(data)
            QBCore.Functions.Progressbar("job:police", "Analyse en cours...", 6000, false, false,
                                         {
                disableMouse = false,
                disableMovement = true,
                disableCarMovement = true,
                disableCombat = true,
            }, {}, {}, {}, function()
                PoliceJob.Functions.Menu.GenerateMenu(PlayerData.job.id, function(menu)
                    menu:AddButton({label = "Argent marqué", rightLabel = data.marked_money .. "$"})

                    if data.marked_money > 0 then
                        local take = menu:AddButton({label = "Confisquer l'argent marqué"})
                        take:On("select", function()
                            QBCore.Functions.Progressbar("jobs_police", "Confiscation...", 6000, false, false,
                                                         {
                                disableMouse = false,
                                disableMovement = true,
                                disableCarMovement = true,
                                disableCombat = true,
                            }, {}, {}, {}, function()
                                -- Done
                                TriggerServerEvent("police:confiscateMoney", GetPlayerServerId(player))
                                menu:Close()
                            end)
                        end)
                    end
                end)
            end)
        end, GetPlayerServerId(player))
    else
        exports["soz-hud"]:DrawNotification("Aucun joueur à proximité", "error")
    end
end)

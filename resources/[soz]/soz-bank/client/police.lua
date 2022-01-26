-- TODO: move this to policejob
local policeMenu = MenuV:CreateMenu("LSPD", "", "default", "soz", "lspd")

-- Display action menu
Citizen.CreateThread(function()
    while true do
        local coords = GetEntityCoords(PlayerPedId())

        if LocalPlayer.state.isLoggedIn then
            if PlayerData.job ~= nil and PlayerData.job.name == "police" then
                if GetDistanceBetweenCoords(coords, Config.MoneyChecker, true) < 1.5 then
                    QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Pour vérifier l'argent")

                    if IsControlJustReleased(0, 51) then
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
                                    policeMenu:ClearItems()

                                    policeMenu:AddButton({label = "Argent sale", rightLabel = data.marked_money .. "$"})

                                    if data.marked_money > 0 then
                                        local take = policeMenu:AddButton({label = "Confisquer l'argent sale"})
                                        take:On("select", function()
                                            QBCore.Functions.Progressbar("jobs_police", "Confiscation...", 6000, false, false, {
                                                disableMouse = false,
                                                disableMovement = true,
                                                disableCarMovement = true,
                                                disableCombat = true,
                                            }, {}, {}, {}, function()
                                                -- Done
                                                TriggerServerEvent("police:confiscateMoney", GetPlayerServerId(player))
                                                policeMenu:Close()
                                            end, function()
                                                -- Cancel
                                            end)
                                        end)
                                    end

                                    policeMenu:Open()
                                end, function()
                                    -- Cancel
                                end)
                            end, GetPlayerServerId(player))
                        else
                            exports["soz-hud"]:DrawNotification("~r~Aucun joueur à proximité")
                        end
                    end
                end

            else
                Wait(1000)
            end
        end

        Wait(0)
    end
end)

-- Display markers
Citizen.CreateThread(function()
    while true do
        if LocalPlayer.state.isLoggedIn then
            if PlayerData.job ~= nil and PlayerData.job.name == "police" then
                DrawMarker(27, Config.MoneyChecker, 0.0, 0.0, 0.0, 0.0, 180.0, 0.0, 1.5, 1.5, 1.5, 39, 112, 186, 50, false, false, 2)
            else
                Wait(1000)
            end
        else
            Wait(1000)
        end

        Wait(0)
    end
end)

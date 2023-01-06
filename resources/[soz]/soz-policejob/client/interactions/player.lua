-- Maybe these permissions could be included in SozJobCore.Jobs in resources/[soz]/soz-jobs/config.lua
local jobCanFine = {"lspd", "bcso"}
local jobCanFouille = {"lspd","bcso", "cash-transfer"}
local jobCanEscort = {"lspd", "bcso", "cash-transfer", "lsmc"}

--- Targets
Citizen.CreateThread(function()
    for _, jobId in pairs(jobCanFine) do
        exports["qb-target"]:AddGlobalPlayer({
            options = {
                    {
                        label = "Amender",
                        color = jobId,
                        icon = "c:police/amender.png",
                        event = "police:client:InvoicePlayer",
                        canInteract = function(player)
                            return PlayerData.job.onduty
                        end,
                        job = jobId,
                        blackoutGlobal = true,
                        blackoutJob = true,
                    },
                    {
                        label = "Permis",
                        color = jobId,
                        icon = "c:police/permis.png",
                        event = "police:client:LicensePlayer",
                        canInteract = function(player)
                            return PlayerData.job.onduty
                        end,
                        job = jobId,
                    },
                    {
                        label = "Menotter",
                        color = jobId,
                        icon = "c:police/menotter.png",
                        event = "police:client:CuffPlayer",
                        item = "handcuffs",
                        canInteract = function(entity)
                            return PlayerData.job.onduty and not IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3) and not IsPedInAnyVehicle(entity) and
                                    not IsPedInAnyVehicle(PlayerPedId())
                        end,
                        job = jobId,
                    },
                    {
                        label = "Démenotter",
                        color = jobId,
                        icon = "c:police/demenotter.png",
                        event = "police:client:UnCuffPlayer",
                        item = "handcuffs_key",
                        canInteract = function(entity)
                            return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3) and not IsPedInAnyVehicle(entity) and
                                    not IsPedInAnyVehicle(PlayerPedId())
                        end,
                        job = jobId,
                    },
            },
            distance = 1.5,
        })
    end
    for _, jobId in pairs(jobCanFouille) do
        exports["qb-target"]:AddGlobalPlayer({
            options = {
                {
                    label = "Fouiller",
                    color = jobId,
                    icon = "c:police/fouiller.png",
                    event = "police:client:SearchPlayer",
                    canInteract = function(entity)
                        if PlayerData.job.id == "cash-transfer" then
                            return exports["soz-jobs"]:WearVIPClothes()
                        end

                        return PlayerData.job.onduty and
                                (IsEntityPlayingAnim(entity, "missminuteman_1ig_2", "handsup_base", 3) or IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3))
                    end,
                    job = jobId,
                },
            },
            distance = 1.5,
        })
    end
    for _, jobId in pairs(jobCanEscort) do
        exports["qb-target"]:AddGlobalPlayer({
            options = {
                {
                    label = "Escorter",
                    color = jobId,
                    icon = "c:police/escorter.png",
                    canInteract = function(entity)
                        local player =  NetworkGetPlayerIndexFromPed(entity)
                        if PlayerData.job.id == "cash-transfer" then
                            if not exports["soz-jobs"]:WearVIPClothes() then
                                return false
                            end
                        end
                        return PlayerData.job.onduty and Player(GetPlayerServerId(player)).state.isEscorted ~= true and not IsPedInAnyVehicle(entity) and
                                not IsPedInAnyVehicle(PlayerPedId())
                    end,
                    job = jobId,
                    action = function(entity)
                        local playerPedCoords = GetEntityCoords(PlayerPedId())
                        local targetPedCoords = GetEntityCoords(entity)
                        local distance = #(playerPedCoords-targetPedCoords)
                        if entity ~= -1 and distance < 2.5 then
                            if not LocalPlayer.state.isEscorted and not LocalPlayer.state.isEscorting and not PlayerData.metadata["isdead"] and
                                not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] then
                                local playerServerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    
                                TriggerServerEvent("police:server:EscortPlayer", playerServerId)
                                TriggerServerEvent("monitor:server:event", "job_police_escort_player", {},
                                                   {target_source = playerServerId, position = GetEntityCoords(entity)}, true)
                            end
                        else
                            exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
                        end
                    end
                },
            },
            distance = 1.5,
        })
    end
end)

--- Events
RegisterNetEvent("police:client:SearchPlayer", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)
    local ped = PlayerPedId()
    local playerPedCoords = GetEntityCoords(ped)
    local targetPedCoords = GetEntityCoords(data.entity)
    local distance = #(playerPedCoords-targetPedCoords)
    if player ~= -1 and distance < 2.5 then
        local playerPed = GetPlayerPed(player)
        local playerId = GetPlayerServerId(player)
        if IsEntityPlayingAnim(playerPed, "missminuteman_1ig_2", "handsup_base", 3) or IsEntityPlayingAnim(playerPed, "mp_arresting", "idle", 3) then
            QBCore.Functions.Progressbar("job:police:search", "Fouille en cours ...", math.random(5000, 7000), false, true,
                                         {
                disableMovement = true,
                disableCarMovement = true,
                disableMouse = false,
                disableCombat = true,
            }, {animDict = "random@shop_robbery", anim = "robbery_action_b", flags = 16}, {}, {}, function() -- Done
                local plyCoords = GetEntityCoords(playerPed)
                local pos = GetEntityCoords(ped)
                if #(pos - plyCoords) < 2.5 then
                    StopAnimTask(ped, "random@shop_robbery", "robbery_action_b", 1.0)
                    TriggerServerEvent("inventory:server:openInventory", "player", playerId)

                    TriggerServerEvent("monitor:server:event", "job_police_search_player", {}, {
                        target_source = playerId,
                        position = plyCoords,
                    }, true)
                else
                    exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
                end
            end, function() -- Cancel
                StopAnimTask(ped, "random@shop_robbery", "robbery_action_b", 1.0)
                exports["soz-hud"]:DrawNotification("Fouille annulée", "error")
            end)
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end
end)

--- Cuff
RegisterNetEvent("police:client:CuffPlayer", function(data)
    if not IsPedRagdoll(PlayerPedId()) then
        local player = NetworkGetPlayerIndexFromPed(data.entity)
        local ped = PlayerPedId()
        local playerPedCoords = GetEntityCoords(ped)
        local targetPedCoords = GetEntityCoords(data.entity)
        local distance = #(playerPedCoords-targetPedCoords)
        if player ~= -1 and distance < 1.5 then
            if not IsPedInAnyVehicle(GetPlayerPed(player)) and not IsPedInAnyVehicle(PlayerPedId()) then
                local playerId = GetPlayerServerId(player)

                TriggerServerEvent("police:server:CuffPlayer", playerId, false)
                TriggerServerEvent("monitor:server:event", "job_police_cuff_player", {},
                                   {target_source = playerId, position = GetEntityCoords(GetPlayerPed(player))}, true)
            else
                exports["soz-hud"]:DrawNotification("Vous ne pouvez pas menotter une personne dans un véhicule", "error")
            end
        else
            exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
        end
    else
        Wait(2000)
    end
end)

RegisterNetEvent("police:client:UnCuffPlayer", function()
    if not IsPedRagdoll(PlayerPedId()) then
        local player = NetworkGetPlayerIndexFromPed(data.entity)
        local ped = PlayerPedId()
        local playerPedCoords = GetEntityCoords(ped)
        local targetPedCoords = GetEntityCoords(data.entity)
        local distance = #(playerPedCoords-targetPedCoords)
        if player ~= -1 and distance < 1.5 then
            if not IsPedInAnyVehicle(GetPlayerPed(player)) and not IsPedInAnyVehicle(PlayerPedId()) then
                local playerId = GetPlayerServerId(player)

                TriggerServerEvent("police:server:UnCuffPlayer", playerId)
                TriggerServerEvent("monitor:server:event", "job_police_uncuff_player", {},
                                   {target_source = playerId, position = GetEntityCoords(GetPlayerPed(player))}, true)
            else
                exports["soz-hud"]:DrawNotification("Vous ne pouvez pas menotter une personne dans un véhicule", "error")
            end
        else
            exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
        end
    else
        Wait(2000)
    end
end)

RegisterNetEvent("police:client:GetCuffed", function(playerId, isSoftcuff)
    local ped = PlayerPedId()
    ClearPedTasksImmediately(ped)
    TriggerEvent("inventory:client:StoreWeapon")

    PoliceJob.Animations.GetCuffed(playerId)
    exports["soz-phone"]:setPhoneDisabled(true)
end)

RegisterNetEvent("police:client:GetUnCuffed", function()
    ClearPedTasksImmediately(PlayerPedId())
    TriggerServerEvent("InteractSound_SV:PlayOnSource", "Uncuff", 0.2)
    exports["soz-phone"]:setPhoneDisabled(false)
end)

--- Invoices
RegisterNetEvent("police:client:InvoicePlayer", function(data)
    PoliceJob.Functions.Menu.GenerateInvoiceMenu(PlayerData.job.id, data.entity)
end)

--- License
RegisterNetEvent("police:client:LicensePlayer", function(data)
    PoliceJob.Functions.Menu.GenerateLicenseMenu(PlayerData.job.id, data.entity)
end)

RegisterNetEvent("police:client:SetEscorting", function(playerId)
    CreateThread(function()
        Wait(1000)

        while LocalPlayer.state.isEscorting do
            if not IsPedSwimming(PlayerPedId()) then
                DisableControlAction(0, 21, true)
            end
            QBCore.Functions.ShowHelpNotification("~INPUT_FRONTEND_RRIGHT~ Pour lâcher")
            if IsControlJustReleased(0, 194) or IsControlJustReleased(0, 225) then
                local player = GetPlayerFromServerId(playerId)
                local playerPedCoords = GetEntityCoords(PlayerPedId())
                local targetPedCoords = GetEntityCoords(GetPlayerPed(player))
                local distance = #(playerPedCoords-targetPedCoords)
                if player ~= -1 and distance < 2.5 then
                    if not LocalPlayer.state.isEscorted and LocalPlayer.state.isEscorting and not PlayerData.metadata["isdead"] and
                        not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] then
                        TriggerServerEvent("police:server:DeEscortPlayer", playerId)
                        TriggerServerEvent("monitor:server:event", "job_police_deescort_player", {},
                                           {target_source = playerId, position = targetPedCoords}, true)
                    else
                        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas arrêter une personne dans un véhicule", "error")
                    end
                else
                    exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
                end
            end
            Wait(1)
        end
    end)
end)

RegisterNetEvent("police:client:GetEscorted", function(playerId)
    local ped = PlayerPedId()
    local dragger = GetPlayerPed(GetPlayerFromServerId(playerId))

    SetEntityCoords(ped, GetOffsetFromEntityInWorldCoords(dragger, 0.0, 0.45, 0.0))
    AttachEntityToEntity(ped, dragger, 11816, 0.45, 0.45, 0.0, 0.0, 0.0, 0.0, false, false, true, true, 2, true)
end)

RegisterNetEvent("police:client:DeEscort", function()
    DetachEntity(PlayerPedId(), true, false)
end)

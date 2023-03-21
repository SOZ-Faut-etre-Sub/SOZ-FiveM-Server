-- Maybe these permissions could be included in SozJobCore.Jobs in resources/[soz]/soz-jobs/config.lua
local jobCanFine = {"lspd", "bcso"}
local jobCanFouille = {"lspd", "bcso", "cash-transfer"}
local jobCanEscort = {"lspd", "bcso", "cash-transfer", "lsmc"}
local jobCanBreathAnalyze = {"lspd", "bcso", "lsmc"}

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
                        local target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                        return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3) and not IsPedInAnyVehicle(entity) and
                                   not IsPedInAnyVehicle(PlayerPedId()) and not Player(target).state.zipped
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
                            if not exports["soz-core"]:WearVIPClothes() then
                                return false
                            end
                        end

                        return PlayerData.job.onduty and
                                   (IsEntityPlayingAnim(entity, "missminuteman_1ig_2", "handsup_base", 3) or
                                       IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3))
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
                    event = "police:client:RequestEscortPlayer",
                    canInteract = function(entity)
                        local player = NetworkGetPlayerIndexFromPed(entity)
                        if PlayerData.job.id == "cash-transfer" then
                            if not exports["soz-core"]:WearVIPClothes() then
                                return false
                            end
                        end
                        return PlayerData.job.onduty and Player(GetPlayerServerId(player)).state.isEscorted ~= true and not IsPedInAnyVehicle(entity) and
                                   not IsPedInAnyVehicle(PlayerPedId())
                    end,
                    job = jobId,
                },
            },
            distance = 1.5,
        })
    end
    for _, jobId in pairs(jobCanBreathAnalyze) do
        exports["qb-target"]:AddGlobalPlayer({
            options = {
                {
                    label = "Alcootest",
                    color = jobId,
                    icon = "c:police/alcootest.png",
                    event = "police:client:breathanalyzer",
                    item = "breathanalyzer",
                    canInteract = function(player)
                        return PlayerData.job.onduty
                    end,
                    job = jobId,
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
    local playerPed = GetPlayerPed(player)
    local playerId = GetPlayerServerId(player)
    if IsEntityPlayingAnim(playerPed, "missminuteman_1ig_2", "handsup_base", 3) or IsEntityPlayingAnim(playerPed, "mp_arresting", "idle", 3) then
        QBCore.Functions.Progressbar("job:police:search", "Fouille en cours ...", math.random(5000, 7000), false, true,
                                     {
            disableMovement = true,
            disableCarMovement = true,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "anim@gangops@morgue@table@", anim = "player_search", flags = 16}, {}, {}, function() -- Done
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
end)

--- Cuff
RegisterNetEvent("police:client:CuffPlayer", function(data)
    if not IsPedRagdoll(PlayerPedId()) then
        local player = NetworkGetPlayerIndexFromPed(data.entity)
        if not IsPedInAnyVehicle(GetPlayerPed(player)) and not IsPedInAnyVehicle(PlayerPedId()) then
            local playerId = GetPlayerServerId(player)

            TriggerServerEvent("police:server:CuffPlayer", playerId, false)
            TriggerServerEvent("monitor:server:event", "job_police_cuff_player", {},
                               {target_source = playerId, position = GetEntityCoords(GetPlayerPed(player))}, true)
        else
            exports["soz-hud"]:DrawNotification("Vous ne pouvez pas menotter une personne dans un véhicule", "error")
        end
    else
        Wait(2000)
    end
end)

RegisterNetEvent("police:client:UnCuffPlayer", function(data)
    if not IsPedRagdoll(PlayerPedId()) then
        local player = NetworkGetPlayerIndexFromPed(data.entity)
        if not IsPedInAnyVehicle(GetPlayerPed(player)) and not IsPedInAnyVehicle(PlayerPedId()) then
            local playerId = GetPlayerServerId(player)

            TriggerServerEvent("police:server:UnCuffPlayer", playerId)
            TriggerServerEvent("monitor:server:event", "job_police_uncuff_player", {},
                               {target_source = playerId, position = GetEntityCoords(GetPlayerPed(player))}, true)
        else
            exports["soz-hud"]:DrawNotification("Vous ne pouvez pas menotter une personne dans un véhicule", "error")
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

--- Escorted
RegisterNetEvent("police:client:RequestEscortPlayer", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)
    if not LocalPlayer.state.isEscorted and not LocalPlayer.state.isEscorting and not PlayerData.metadata["isdead"] and not PlayerData.metadata["ishandcuffed"] and
        not PlayerData.metadata["inlaststand"] then
        local playerId = GetPlayerServerId(player)

        TriggerServerEvent("police:server:EscortPlayer", playerId, data.crimi)
        TriggerServerEvent("monitor:server:event", "job_police_escort_player", {},
                           {
            target_source = playerId,
            crimi = data.crimi,
            position = GetEntityCoords(GetPlayerPed(player)),
        }, true)
    end
end)

RegisterNetEvent("police:client:SetEscorting", function(target, crimi)
    local ped = PlayerPedId()
    local dict = "anim@gangops@hostage@"
    local anim = "perp_idle"

    if crimi then

        QBCore.Functions.RequestAnimDict(dict)
        TaskPlayAnim(ped, dict, anim, 4.0, 1.0, -1, 50, 0.0, false, false, false);
    end

    CreateThread(function()
        Wait(1000)

        while LocalPlayer.state.isEscorting do
            if not IsPedSwimming(ped) then
                DisableControlAction(0, 21, true)
            end
            QBCore.Functions.ShowHelpNotification("~INPUT_FRONTEND_RRIGHT~ Pour lâcher")

            if LocalPlayer.state.isEscorted or PlayerData.metadata["isdead"] or PlayerData.metadata["ishandcuffed"] or PlayerData.metadata["inlaststand"] or
                IsControlJustReleased(0, 194) or (not crimi and IsControlJustReleased(0, 225)) or (crimi and not IsEntityPlayingAnim(ped, dict, anim, 3)) then

                TriggerServerEvent("police:server:DeEscortPlayer", target)
                TriggerServerEvent("monitor:server:event", "job_police_deescort_player", {},
                                   {target_source = playerId, position = GetEntityCoords(GetPlayerPed(player))}, true)
                ClearPedTasks(ped);
            end
            Wait(1)
        end
    end)
end)

RegisterNetEvent("police:client:GetEscorted", function(playerId, crimi)
    local ped = PlayerPedId()
    local dragger = GetPlayerPed(GetPlayerFromServerId(playerId))

    local delta_x = 0.45
    local delta_y = 0.45
    local rota_z = 0

    if crimi then
        delta_x = -0.3
        delta_y = 0.08
        rota_z = 26.1

        ClearPedTasksImmediately(ped)
    end

    SetEntityCoords(ped, GetOffsetFromEntityInWorldCoords(dragger, delta_x, delta_y, 0.0))
    AttachEntityToEntity(ped, dragger, 11816, delta_x, delta_y, 0.0, 0.0, 0.0, rota_z, false, false, true, true, 2, true)

    if crimi then
        Wait(100)
        local dict = "anim@gangops@hostage@"
        local anim = "victim_idle"
        QBCore.Functions.RequestAnimDict(dict)
        TaskPlayAnim(ped, dict, anim, 4.0, 1.0, -1, 50, 0.0, false, false, false)
    end

end)

RegisterNetEvent("police:client:DeEscort", function()
    local ped = PlayerPedId()
    DetachEntity(ped, true, false)
    ClearPedTasks(ped)
end)

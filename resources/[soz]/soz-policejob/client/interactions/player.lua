--- Targets
CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Amendes",
                icon = "fas fa-file-invoice-dollar",
                event = "police:client:InvoicePlayer",
                job = {["lspd"] = 0, ["lscs"] = 0},
            },
            {
                label = "Fouiller",
                icon = "fas fa-shopping-bag",
                event = "police:client:SearchPlayer",
                canInteract = function(entity)
                    return IsEntityPlayingAnim(entity, "missminuteman_1ig_2", "handsup_base", 3) or IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3)
                end,
                job = {["lspd"] = 0, ["lscs"] = 0},
            },
            {
                label = "Menotter",
                icon = "fas fa-key",
                event = "police:client:CuffPlayer",
                item = "handcuffs",
                canInteract = function(entity)
                    return not IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3) and not IsPedInAnyVehicle(entity) and not IsPedInAnyVehicle(PlayerPedId())
                end,
                job = {["lspd"] = 0, ["lscs"] = 0},
            },
            {
                label = "Démenotter",
                icon = "fas fa-key",
                event = "police:client:UnCuffPlayer",
                item = "handcuffs_key",
                canInteract = function(entity)
                    return IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3) and not IsPedInAnyVehicle(entity) and not IsPedInAnyVehicle(PlayerPedId())
                end,
                job = {["lspd"] = 0, ["lscs"] = 0},
            },
            {
                label = "Escorter",
                icon = "fas fa-handshake",
                event = "police:client:RequestEscortPlayer",
                canInteract = function(entity)
                    local player, _ = QBCore.Functions.GetClosestPlayer()
                    return Player(GetPlayerServerId(player)).state.isEscorted ~= true and IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3) and
                               not IsPedInAnyVehicle(entity) and not IsPedInAnyVehicle(PlayerPedId())
                end,
                job = {["lspd"] = 0, ["lscs"] = 0},
            },
            {
                label = "Relâcher",
                icon = "fas fa-handshake-slash",
                event = "police:client:RequestDeEscortPlayer",
                canInteract = function(entity)
                    local player, _ = QBCore.Functions.GetClosestPlayer()
                    return Player(GetPlayerServerId(player)).state.isEscorted == true and IsEntityPlayingAnim(entity, "mp_arresting", "idle", 3) and
                               not IsPedInAnyVehicle(entity) and not IsPedInAnyVehicle(PlayerPedId())
                end,
                job = {["lspd"] = 0, ["lscs"] = 0},
            },
        },
        distance = 1.5,
    })
end)

--- Events
RegisterNetEvent("police:client:SearchPlayer", function()
    local player, distance = QBCore.Functions.GetClosestPlayer()
    local ped = PlayerPedId()
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
                else
                    exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
                end
            end, function() -- Cancel
                StopAnimTask(ped, "random@shop_robbery", "robbery_action_b", 1.0)
                exports["soz-hud"]:DrawNotification("~r~Fouille annulée")
            end)
        end
    else
        exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
    end
end)

--- Cuff
RegisterNetEvent("police:client:CuffPlayer", function()
    if not IsPedRagdoll(PlayerPedId()) then
        local player, distance = QBCore.Functions.GetClosestPlayer()
        if player ~= -1 and distance < 1.5 then
            if not IsPedInAnyVehicle(GetPlayerPed(player)) and not IsPedInAnyVehicle(PlayerPedId()) then
                TriggerServerEvent("police:server:CuffPlayer", GetPlayerServerId(player), false)
            else
                exports["soz-hud"]:DrawNotification("~r~Vous ne pouvez pas menotter une personne dans un véhicule")
            end
        else
            exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
        end
    else
        Wait(2000)
    end
end)

RegisterNetEvent("police:client:UnCuffPlayer", function()
    if not IsPedRagdoll(PlayerPedId()) then
        local player, distance = QBCore.Functions.GetClosestPlayer()
        if player ~= -1 and distance < 1.5 then
            if not IsPedInAnyVehicle(GetPlayerPed(player)) and not IsPedInAnyVehicle(PlayerPedId()) then
                TriggerServerEvent("police:server:UnCuffPlayer", GetPlayerServerId(player))
            else
                exports["soz-hud"]:DrawNotification("~r~Vous ne pouvez pas menotter une personne dans un véhicule")
            end
        else
            exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
        end
    else
        Wait(2000)
    end
end)

RegisterNetEvent("police:client:GetCuffed", function(playerId, isSoftcuff)
    local ped = PlayerPedId()
    ClearPedTasksImmediately(ped)
    if GetSelectedPedWeapon(ped) ~= WEAPON_UNARMED then
        SetCurrentPedWeapon(ped, WEAPON_UNARMED, true)
    end

    PoliceJob.Animations.GetCuffed(playerId)
end)

RegisterNetEvent("police:client:GetUnCuffed", function()
    ClearPedTasksImmediately(PlayerPedId())
    TriggerServerEvent("InteractSound_SV:PlayOnSource", "Uncuff", 0.2)
end)

--- Invoices
RegisterNetEvent("police:client:InvoicePlayer", function(data)
    PoliceJob.Functions.Menu.GenerateInvoiceMenu(PlayerData.job.id, data.entity)
end)

--- Escorted
RegisterNetEvent("police:client:RequestEscortPlayer", function()
    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.5 then
        if not LocalPlayer.state.isEscorted and not LocalPlayer.state.isEscorting and not PlayerData.metadata["isdead"] and
            not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] then
            TriggerServerEvent("police:server:EscortPlayer", GetPlayerServerId(player))
        end
    else
        exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
    end
end)

RegisterNetEvent("police:client:RequestDeEscortPlayer", function()
    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.5 then
        if not LocalPlayer.state.isEscorted and LocalPlayer.state.isEscorting and not PlayerData.metadata["isdead"] and not PlayerData.metadata["ishandcuffed"] and
            not PlayerData.metadata["inlaststand"] then
            TriggerServerEvent("police:server:DeEscortPlayer", GetPlayerServerId(player))
        end
    else
        exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
    end
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

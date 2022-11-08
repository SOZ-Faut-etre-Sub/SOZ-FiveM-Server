--- Targets
RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if not duty then
        return
    end

    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                label = "Immatriculation",
                color = PlayerData.job.id,
                icon = "c:police/immatriculation.png",
                event = "police:client:getVehicleOwner",
                canInteract = function(player)
                    return PlayerData.job.onduty
                end,
                job = {["lspd"] = 0, ["bcso"] = 0},
                blackoutGlobal = true,
                blackoutJob = true,
            },
            {
                label = "Fouiller",
                color = PlayerData.job.id,
                icon = "c:police/fouiller_vehicle.png",
                event = "police:client:SearchVehicle",
                canInteract = function(player)
                    return PlayerData.job.onduty
                end,
                job = {["lspd"] = 0, ["bcso"] = 0},
            },
            {
                label = "Ouvrir",
                color = PlayerData.job.id,
                icon = "c:police/forcer.png",
                event = "police:client:LockPickVehicle",
                canInteract = function(player)
                    return PlayerData.job.onduty
                end,
                job = {["lspd"] = 0, ["bcso"] = 0},
            },
        },
        distance = 1.5,
    })
end)

--- Events
RegisterNetEvent("police:client:getVehicleOwner", function(data)
    QBCore.Functions.Progressbar("police:vehicle:check", "Vérification de la plaque en cours...", 8000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {task = "CODE_HUMAN_MEDIC_KNEEL"}, {}, {}, function()
        local plate = QBCore.Functions.GetPlate(data.entity)
        local playerName = QBCore.Functions.TriggerRpc("police:server:getVehicleOwner", plate)

        exports["soz-hud"]:DrawAdvancedNotification("San Andres", "Vérification de plaque", ("Propriétaire: ~b~%s"):format(playerName), "CHAR_DAVE")
    end)
end)

RegisterNetEvent("police:client:SearchVehicle", function(data)
    QBCore.Functions.Progressbar("police:vehicle:check", "Vérification du coffre en cours...", 8000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "amb@prop_human_bum_bin@idle_a", anim = "idle_a", flags = 16}, {}, {}, function()
        local plate = QBCore.Functions.GetPlate(data.entity)
        local model = GetEntityModel(data.entity)
        local class = GetVehicleClass(data.entity)

        TriggerServerEvent("inventory:server:openInventory", "trunk", plate, {model = model, class = class})
    end)
end)

RegisterNetEvent("police:client:LockPickVehicle", function(data)
    QBCore.Functions.Progressbar("police:vehicle:lockpick", "Déverrouillage du véhicule en cours...", 8000, true, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {task = "WORLD_HUMAN_WELDING"}, {}, {}, function()
        local networkId = NetworkGetNetworkIdFromEntity(data.entity)

        TriggerServerEvent("soz-core:server:vehicle:force-open", networkId)
    end)
end)

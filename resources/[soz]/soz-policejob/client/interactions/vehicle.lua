--- Targets
CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                label = "Immatriculation",
                color = "lspd",
                icon = "c:police/immatriculation.png",
                event = "police:client:getVehicleOwner",
                canInteract = function(player)
                    return PlayerData.job.onduty
                end,
                job = {["lspd"] = 0, ["bcso"] = 0},
            },
            {
                label = "Fouiller",
                color = "lspd",
                icon = "c:police/fouiller_vehicle.png",
                event = "police:client:SearchVehicle",
                canInteract = function(player)
                    return PlayerData.job.onduty
                end,
                job = {["lspd"] = 0, ["bcso"] = 0},
            },
            -- {
            --     label = "Poser une balise GPS",
            --     icon = "fas fa-map-marked-alt",
            --     event = "",
            --     job = {["lspd"] = 0, ["bcso"] = 0},
            -- },
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
    }, {animDict = "missheistdockssetup1clipboard@base", anim = "base", flags = 16}, {
        model = "prop_notepad_01",
        bone = 18905,
        coords = {x = 0.1, y = 0.02, z = 0.05},
        rotation = {x = 10.0, y = 0.0, z = 0.0},
    }, {
        model = "prop_pencil_01",
        bone = 58866,
        coords = {x = 0.11, y = -0.02, z = 0.001},
        rotation = {x = -120.0, y = 0.0, z = 0.0},
    }, function()
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
    }, {animDict = "mp_arresting", anim = "a_uncuff", flags = 16}, {}, {}, function()
        local plate = QBCore.Functions.GetPlate(data.entity)

        TriggerServerEvent("inventory:server:openInventory", "trunk", plate)
    end)
end)

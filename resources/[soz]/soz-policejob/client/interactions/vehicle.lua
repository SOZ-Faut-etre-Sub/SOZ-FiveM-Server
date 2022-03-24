--- Targets
CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                label = "Immatriculation",
                icon = "fas fa-id-card",
                event = "police:client:getVehicleOwner",
                job = {["lspd"] = 0, ["bcso"] = 0},
            },
            {
                label = "Fouiller",
                icon = "fas fa-truck-loading",
                event = "police:client:SearchVehicle",
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
    QBCore.Functions.Progressbar("police:vehicle:check", "Vérification de la plaque en cours...", 2500, false, true, {}, {}, {}, {}, function()
        local plate = QBCore.Functions.GetPlate(data.entity)
        local playerName = QBCore.Functions.TriggerRpc("police:server:getVehicleOwner", plate)

        exports["soz-hud"]:DrawAdvancedNotification("San Andres", "Vérification de plaque", ("Propriétaire: ~b~%s"):format(playerName), "CHAR_DAVE")
    end)
end)

RegisterNetEvent("police:client:SearchVehicle", function(data)
    QBCore.Functions.Progressbar("police:vehicle:check", "Vérification du coffre en cours...", 2500, false, true, {}, {}, {}, {}, function()
        local plate = QBCore.Functions.GetPlate(data.entity)

        TriggerServerEvent("inventory:server:openInventory", "trunk", plate)
    end)
end)

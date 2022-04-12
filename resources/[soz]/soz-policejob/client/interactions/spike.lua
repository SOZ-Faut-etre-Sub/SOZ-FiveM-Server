local spikeModel = GetHashKey("p_ld_stinger_s")
local spawnedSpikes, closestSpike = {}, nil

--- Targets
CreateThread(function()
    exports["qb-target"]:AddTargetModel({spikeModel}, {
        options = {
            {
                label = "Démonter",
                icon = "c:jobs/demonter.png",
                event = "police:client:RequestRemoveSpike",
                job = {["lspd"] = 0, ["bcso"] = 0},
            },
        },
        distance = 2.5,
    })
    exports["qb-target"]:AddTargetModel({"prop_barrier_work05"}, {
        options = {
            {
                label = "Démonter",
                icon = "c:jobs/demonter.png",
                event = "job:client:RemoveObject",
                job = {["lspd"] = 0, ["bcso"] = 0},
            },
        },
        distance = 2.5,
    })
end)

--- Events
RegisterNetEvent("police:client:RequestAddSpike", function()
    local ped = PlayerPedId()
    local entityCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 2.0, 0.0)
    local entityHeading = GetEntityHeading(ped)

    QBCore.Functions.Progressbar("spawn_object", "Lancement de la herse en cours", 2500, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@narcotics@trash", anim = "drop_front", flags = 16}, {}, {}, function() -- Done
        StopAnimTask(PlayerPedId(), "anim@narcotics@trash", "drop_front", 1.0)
        TriggerServerEvent("police:server:AddSpike", QBCore.Functions.GetProperGroundCoord(spikeModel, entityCoords, entityHeading))
    end, function() -- Cancel
        StopAnimTask(PlayerPedId(), "anim@narcotics@trash", "drop_front", 1.0)
    end)
end)

RegisterNetEvent("police:client:RequestRemoveSpike", function(data)
    QBCore.Functions.Progressbar("remove_object", "Récupération de la herse en cours", 2500, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "weapons@first_person@aim_rng@generic@projectile@thermal_charge@", anim = "plant_floor", flags = 16}, {}, {}, function() -- Done
        StopAnimTask(PlayerPedId(), "weapons@first_person@aim_rng@generic@projectile@thermal_charge@", "plant_floor", 1.0)
        TriggerServerEvent("police:server:RemoveSpike", ObjToNet(data.entity))
    end, function() -- Cancel
        StopAnimTask(PlayerPedId(), "weapons@first_person@aim_rng@generic@projectile@thermal_charge@", "plant_floor", 1.0)
    end)
end)

RegisterNetEvent("police:client:SyncSpikes", function(table)
    spawnedSpikes = table
end)

--- Threads
CreateThread(function()
    while true do
        if LocalPlayer.state.isLoggedIn then
            local pos = GetEntityCoords(PlayerPedId(), true)
            local current, dist

            for spikeID, spike in pairs(spawnedSpikes) do
                if current == nil then
                    dist = #(pos - vector3(spike.x, spike.y, spike.z))
                    current = spikeID
                elseif current then
                    if #(pos - vector3(spike.x, spike.y, spike.z)) < dist then
                        current = spikeID
                    end
                end
            end
            closestSpike = current
        end

        Wait(500)
    end
end)

CreateThread(function()
    while true do
        if LocalPlayer.state.isLoggedIn then
            local ped = PlayerPedId()
            local coords = GetEntityCoords(ped)
            local vehicle = GetVehiclePedIsIn(ped, false)

            if closestSpike and spawnedSpikes[closestSpike] and vehicle then
                local spikePos = vector3(spawnedSpikes[closestSpike].x, spawnedSpikes[closestSpike].y, spawnedSpikes[closestSpike].z)

                if #(spikePos - coords) <= 10 then
                    local tires = {
                        {bone = "wheel_lf", index = 0},
                        {bone = "wheel_rf", index = 1},
                        {bone = "wheel_lm", index = 2},
                        {bone = "wheel_rm", index = 3},
                        {bone = "wheel_lr", index = 4},
                        {bone = "wheel_rr", index = 5},
                    }

                    for a = 1, #tires do
                        local tirePos = GetWorldPositionOfEntityBone(vehicle, GetEntityBoneIndexByName(vehicle, tires[a].bone))

                        if #(tirePos - spikePos) < 1.8 then
                            if not IsVehicleTyreBurst(vehicle, tires[a].index, true) or IsVehicleTyreBurst(vehicle, tires[a].index, false) then
                                SetVehicleTyreBurst(vehicle, tires[a].index, false, 1000.0)
                                TriggerServerEvent("police:server:RemoveSpike", closestSpike)
                            end
                        end
                    end
                end
            end
        end

        Wait(3)
    end
end)

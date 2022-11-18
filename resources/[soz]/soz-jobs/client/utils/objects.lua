local removalObject = {"prop_roadcone02a"}

local CalculateRef = function(entity)
    local coord = GetEntityCoords(entity)
    return tostring(GetEntityModel(entity)) .. QBCore.Shared.Round(coord.x) .. QBCore.Shared.Round(coord.y) .. QBCore.Shared.Round(coord.z)
end

--- Targets
CreateThread(function()
    exports["qb-target"]:AddTargetModel(removalObject,
                                        {
        options = {{label = "Démonter", icon = "c:jobs/demonter.png", event = "job:client:RemoveObject"}},
        distance = 2.5,
    })
end)

--- Add Object
RegisterNetEvent("job:client:AddObject", function(objectHash, rotation, offset)
    local ped = PlayerPedId()
    local coords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 1.0, 0.0)
    local heading = GetEntityHeading(ped) + (rotation or 0.0)

    QBCore.Functions.Progressbar("spawn_object", "Disposition en cours", 2500, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@narcotics@trash", anim = "drop_front", flags = 16}, {}, {}, function() -- Done
        TriggerServerEvent("job:server:AddObject", objectHash, QBCore.Functions.GetProperGroundCoord(objectHash, coords, heading, offset))
    end)
end)

--- Remove Object
RegisterNetEvent("job:client:RemoveObject", function(data)
    QBCore.Functions.Progressbar("remove_object", data.collect and "Récupération en cours" or "Démontage en cours", 2500, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "weapons@first_person@aim_rng@generic@projectile@thermal_charge@", anim = "plant_floor", flags = 16}, {}, {}, function() -- Done
        StopAnimTask(PlayerPedId(), "weapons@first_person@aim_rng@generic@projectile@thermal_charge@", "plant_floor", 1.0)
        if data.collect then
            TriggerServerEvent("job:server:CollectObject", CalculateRef(data.entity), GetEntityModel(data.entity))
        else
            TriggerServerEvent("job:server:RemoveObject", CalculateRef(data.entity))
        end
    end, function() -- Cancel
        StopAnimTask(PlayerPedId(), "weapons@first_person@aim_rng@generic@projectile@thermal_charge@", "plant_floor", 1.0)
    end)
end)

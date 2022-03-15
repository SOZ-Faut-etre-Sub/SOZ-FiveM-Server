local spikeModel = GetHashKey("p_ld_stinger_s")
local spawnedSpikes, closestSpike = {}, nil

--- Targets
CreateThread(function()
    exports["qb-target"]:AddTargetModel({spikeModel}, {
        options = {
            {
                label = "Supprimer la herse",
                icon = "fas fa-times",
                event = "police:client:RequestRemoveSpike",
                job = {["lspd"] = 0, ["lscs"] = 0},
            }
        },
        distance = 2.5,
    })
end)

--- Functions

--- Used to send clean ground coord to server
local function GetProperGroundCoord(position, heading)
    --- Generate ghost spike
    local spike = CreateObject(spikeModel, position.x, position.y, position.z, false)
    SetEntityVisible(spike, false)
    SetEntityHeading(spike, heading)
    PlaceObjectOnGroundProperly(spike)

    --- Clean entity
    position = GetEntityCoords(spike)
    DeleteObject(spike)

    return vector4(position.x, position.y, position.z, heading)
end

--- Events
RegisterNetEvent("police:client:RequestAddSpike", function()
    local ped = PlayerPedId()
    local entityCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 2.0, 0.0)
    local entityHeading = GetEntityHeading(ped)

    TriggerServerEvent("police:server:AddSpike", GetProperGroundCoord(entityCoords, entityHeading))
end)

RegisterNetEvent("police:client:RequestRemoveSpike", function(data)
    TriggerServerEvent("police:server:RemoveSpike", ObjToNet(data.entity))
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

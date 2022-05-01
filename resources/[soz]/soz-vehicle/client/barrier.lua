local gates = {[GetHashKey("prop_sec_barrier_ld_01a")] = true, [GetHashKey("prop_sec_barrier_ld_02a")] = true}

local closestGate = {}

Citizen.CreateThread(function()
    while true do
        local coords = GetEntityCoords(PlayerPedId())
        local objects = GetGamePool("CObject")

        for i = 1, #objects, 1 do
            local objectModel = GetEntityModel(objects[i])
            local objectCoords = GetEntityCoords(objects[i])

            if gates[objectModel] and #(objectCoords - coords) <= 15.0 then
                closestGate[objects[i]] = false
            end
        end

        Wait(1000)
    end
end)

Citizen.CreateThread(function()
    while true do
        local coords = GetEntityCoords(PlayerPedId())

        for gate, state in pairs(closestGate) do
            CreateThread(function()
                if state then
                    return
                end

                closestGate[gate] = true
                if DoesEntityExist(gate) then
                    local gateRotation = GetEntityRotation(gate, 0)

                    if #(GetEntityCoords(gate) - coords) <= 15.0 then
                        while gateRotation.y >= -89.5 do
                            SetEntityRotation(gate, gateRotation.x, gateRotation.y - 1.0, gateRotation.z, 0, true)
                            gateRotation = GetEntityRotation(gate, 0)

                            if not DoesEntityExist(gate) then
                                break
                            end

                            Wait(0)
                        end
                    else
                        while gateRotation.y <= -0.5 do
                            SetEntityRotation(gate, gateRotation.x, gateRotation.y + 1.0, gateRotation.z, 0, true)
                            gateRotation = GetEntityRotation(gate, 0)

                            if not DoesEntityExist(gate) then
                                break
                            end

                            Wait(0)
                        end
                        closestGate[gate] = nil
                    end
                else
                    closestGate[gate] = nil
                end

                closestGate[gate] = false
            end)
        end

        Wait(500)
    end
end)


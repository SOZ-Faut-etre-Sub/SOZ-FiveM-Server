local gates = {GetHashKey("prop_sec_barrier_ld_01a"), GetHashKey("prop_sec_barrier_ld_02a")}

local closestGate = {}

Citizen.CreateThread(
    function()
        while true do
            local coords = GetEntityCoords(PlayerPedId())

            for _, gate in pairs(gates) do
                local searchGate = GetClosestObjectOfType(coords.x, coords.y, coords.z, 40.0, gate, false, false, false)

                if searchGate ~= 0 then
                    closestGate[searchGate] = true
                end
            end

            Wait(500)
        end
    end
)

Citizen.CreateThread(
    function()
        while true do
            local coords = GetEntityCoords(PlayerPedId())

            for gate, _ in pairs(closestGate) do
                if DoesEntityExist(gate) then
                    local gateRotation = GetEntityRotation(gate, 0)

                    if #(GetEntityCoords(gate) - coords) <= 20.0 then
                        while gateRotation.y >= -89.5 do
                            SetEntityRotation(gate, gateRotation.x, gateRotation.y - 0.5, gateRotation.z, 0, true)
                            gateRotation = GetEntityRotation(gate, 0)

                            if not DoesEntityExist(gate) then
                                break
                            end

                            Wait(1)
                        end
                    else
                        while gateRotation.y <= -0.5 do
                            SetEntityRotation(gate, gateRotation.x, gateRotation.y + 0.5, gateRotation.z, 0, true)
                            gateRotation = GetEntityRotation(gate, 0)

                            if not DoesEntityExist(gate) then
                                break
                            end

                            Wait(1)
                        end
                        closestGate[gate] = nil
                    end
                else
                    closestGate[gate] = nil
                end
            end

            Wait(500)
        end
    end
)


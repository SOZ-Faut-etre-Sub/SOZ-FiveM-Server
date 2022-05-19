local DOOR_INDEX_CONFIG = {
    ["seat_dside_f"] = -1,
    ["seat_pside_f"] = 0,
    ["seat_dside_r"] = 1,
    ["seat_pside_r"] = 2,
    ["door_dside_f"] = -1,
    ["door_pside_f"] = 0,
    ["door_dside_r"] = 1,
    ["door_pside_r"] = 2,
    ["wheel_lr"] = {3, 5},
    ["wheel_rr"] = {4, 6},
}

Citizen.CreateThread(function()
    while true do
        local playerPed = GetPlayerPed(-1)
        SetPedConfigFlag(playerPed, 220, true)

        local vehicle = GetVehiclePedIsTryingToEnter(playerPed)
        local IsInVehicle = IsPedInAnyVehicle(playerPed, false)

        -- Enter only if there is a vehicle, ped is not in vehicle and lock status is ok
        if vehicle ~= 0 and not IsInVehicle and GetVehicleDoorLockStatus(vehicle) ~= 2 then
            local max = GetVehicleMaxNumberOfPassengers(vehicle)
            local playerPos = GetEntityCoords(playerPed, false)
            local minDistance = 2.0
            local closestDoor = nil

            for bone, seatIndex in pairs(DOOR_INDEX_CONFIG) do
                -- Avoid using same seat as an existing ped
                local useSeat = false
                local availableSeatIndex = seatIndex

                -- Get available seat (skip seat where there is an existing ped)
                if type(seatIndex) == "number" then
                    useSeat = GetPedInVehicleSeat(vehicle, seatIndex) == 0
                else
                    availableSeatIndex = max

                    for _, index in pairs(seatIndex) do
                        if not useSeat and GetPedInVehicleSeat(vehicle, index) == 0 then
                            useSeat = true
                            availableSeatIndex = index
                        end
                    end
                end

                -- Check available seat is not outbound
                if availableSeatIndex > max - 1 then
                    useSeat = false
                end

                if useSeat then
                    local bonePos = GetWorldPositionOfEntityBone(vehicle, GetEntityBoneIndexByName(vehicle, bone))
                    local distance = #(playerPos - bonePos)

                    if closestDoor == nil then
                        if distance <= minDistance then
                            closestDoor = {
                                bone = bone,
                                boneDist = distance,
                                bonePos = bonePos,
                                seatIndex = availableSeatIndex,
                            }
                        end
                    else
                        if distance < closestDoor.boneDist then
                            closestDoor = {
                                bone = bone,
                                boneDist = distance,
                                bonePos = bonePos,
                                seatIndex = availableSeatIndex,
                            }
                        end
                    end
                end
            end

            if closestDoor ~= nil then
                -- ClearPedTasksImmediately(playerPed)
                TaskEnterVehicle(playerPed, vehicle, -1, closestDoor.seatIndex, 1.0, 1, 0)
                Wait(200)

                local enteringVehicle = GetVehiclePedIsEntering(playerPed) or GetVehiclePedIsTryingToEnter(playerPed)

                while enteringVehicle ~= 0 do
                    Wait(200)

                    enteringVehicle = GetVehiclePedIsEntering(playerPed) or GetVehiclePedIsTryingToEnter(playerPed)
                end
            end
        end

        Wait(0)
    end
end)

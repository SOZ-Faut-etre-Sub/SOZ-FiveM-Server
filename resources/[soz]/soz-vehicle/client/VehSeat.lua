delay = 800

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(delay)
        delay = 800

        local ped = PlayerPedId()
        local pco = GetEntityCoords(ped)
        local vehicle = GetClosestVehicle(pco, 5.0, 0, 71)
        if DoesEntityExist(vehicle) and IsEntityAVehicle(vehicle) and IsPedAPlayer(GetPedInVehicleSeat(vehicle, -1)) or DoesEntityExist(vehicle) and IsEntityAVehicle(vehicle) and GetPedInVehicleSeat(vehicle, -1) == 0 then
            delay = 25
            local bldoor = GetWorldPositionOfEntityBone(vehicle, GetEntityBoneIndexByName(vehicle, "window_lr"))
            local brdoor = GetWorldPositionOfEntityBone(vehicle, GetEntityBoneIndexByName(vehicle, "window_rr"))
            local playerpos = GetEntityCoords(GetPlayerPed(-1), 1)
            local distanceToBrdoor = GetDistanceBetweenCoords(brdoor, playerpos, 1)
            local distanceToBldoor = GetDistanceBetweenCoords(bldoor, playerpos, 1)
            if distanceToBrdoor < 0.9 and DoesVehicleHaveDoor(vehicle, 3) and not DoesEntityExist(GetPedInVehicleSeat(vehicle, 2)) and GetVehicleDoorLockStatus(vehicle) ~= 2 then
                if (IsControlJustPressed(1, 49)) then
                    TaskEnterVehicle(PlayerPedId(), vehicle, 10000, 2, 1.0, 1, 0)
                end
            elseif distanceToBldoor < 0.9 and DoesVehicleHaveDoor(vehicle, 2) and not DoesEntityExist(GetPedInVehicleSeat(vehicle, 1)) and GetVehicleDoorLockStatus(vehicle) ~= 2 then
                if (IsControlJustPressed(1, 49)) then
                    TaskEnterVehicle(PlayerPedId(), vehicle, 10000, 1, 1.0, 1, 0)
                end
            end
        end



    end
end)

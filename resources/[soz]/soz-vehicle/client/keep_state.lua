CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)

        if IsPedInAnyVehicle(ped, false) and IsControlPressed(2, 75) and not IsEntityDead(ped) and (GetVehicleDoorLockStatus(vehicle) == 1) then
            Wait(150)
            if IsPedInAnyVehicle(ped, false) and IsControlPressed(2, 75) and not IsEntityDead(ped) and (GetVehicleDoorLockStatus(vehicle) == 1) then
                SetVehicleEngineOn(vehicle, true, true, false)
                TaskLeaveVehicle(ped, vehicle, 0)
            end
        end

        Wait(0)
    end
end)

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)
        if IsPedInAnyVehicle(ped, false) and GetPedInVehicleSeat(vehicle, -1) == ped then
            local state = Entity(vehicle).state
            if not state.isDead then
                if IsEntityDead(vehicle) then
                    state.isDead = true
                    TriggerServerEvent("qb-garage:server:setVehicleDestroy", GetVehicleNumberPlateText(vehicle))
                end
            end
        end
        Wait(100)
    end
end)

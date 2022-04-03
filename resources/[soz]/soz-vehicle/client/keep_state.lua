CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)

        if IsPedInAnyVehicle(ped, false) and IsControlPressed(2, 75) and not IsEntityDead(ped) then
            Wait(150)
            if IsPedInAnyVehicle(ped, false) and IsControlPressed(2, 75) and not IsEntityDead(ped) then
                SetVehicleEngineOn(vehicle, true, true, false)
                TaskLeaveVehicle(ped, vehicle, 0)
            end
        end

        Wait(0)
    end
end)

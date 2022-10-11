Citizen.CreateThread(function()
    while true do
        local player = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player, false)
        local vehicleClass = GetVehicleClass(vehicle)

        if IsPedInAnyVehicle(player, 1) and GetPedInVehicleSeat(vehicle, -1) == player then
            if Config.DisableControl[vehicleClass] then
                if IsEntityInAir(vehicle) or IsEntityUpsidedown(vehicle) then
                    DisableControlAction(2, 59)
                    DisableControlAction(2, 60)
                end
            else
                Wait(500)
            end
        else
            Wait(5000)
        end

        Wait(0)
    end
end)

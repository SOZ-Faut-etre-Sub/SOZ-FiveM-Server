local vehicleState = nil

AddStateBagChangeHandler("indicators", nil, function(bagName, _, value, _, _)
    local vehNet = bagName:gsub("entity:", "")
    local vehicle = NetToVeh(tonumber(vehNet))

    if DoesEntityExist(vehicle) then
        SetVehicleIndicatorLights(vehicle, 1, value.left)
        SetVehicleIndicatorLights(vehicle, 0, value.right)
    end
end)

CreateThread(function()
    while true do
        local ped = PlayerPedId()

        if IsPedInAnyVehicle(ped, false) then
            local vehicle = GetVehiclePedIsIn(ped, false)
            if vehicleState == nil then
                vehicleState = Entity(vehicle).state.indicators or {left = false, right = false}
            end

            if NetworkHasControlOfEntity(vehicle) then
                if IsControlJustPressed(0, 189) then
                    vehicleState.left = not vehicleState.left
                    Entity(vehicle).state:set("indicators", vehicleState, true)
                end
                if IsControlJustPressed(0, 190) then
                    vehicleState.right = not vehicleState.right
                    Entity(vehicle).state:set("indicators", vehicleState, true)
                end
            else
                Wait(1000)
            end
        else
            vehicleState = nil
            Wait(1000)
        end

        Wait(1)
    end
end)

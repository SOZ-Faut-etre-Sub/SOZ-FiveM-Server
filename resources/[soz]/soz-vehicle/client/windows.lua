AddStateBagChangeHandler("windows", nil, function(bagName, _, value, _, _)
    local vehNet = bagName:gsub("entity:", "")
    local vehicle = NetToVeh(tonumber(vehNet))

    if DoesEntityExist(vehicle) then
        if value then
            RollUpWindow(vehicle, 0)
            RollUpWindow(vehicle, 1)
        else
            RollDownWindow(vehicle, 0)
            RollDownWindow(vehicle, 1)
        end
    end
end)

CreateThread(function()
    while true do
        local ped = PlayerPedId()

        if IsPedInAnyVehicle(ped, false) then
            local vehicle = GetVehiclePedIsIn(ped, false)

            if NetworkHasControlOfEntity(vehicle) then
                if IsControlJustPressed(0, 188) then
                    Entity(vehicle).state:set("windows", true, true)
                end
                if IsControlJustPressed(0, 187) then
                    Entity(vehicle).state:set("windows", false, true)
                end
            else
                Wait(1000)
            end
        else
            Wait(1000)
        end

        Wait(1)
    end
end)

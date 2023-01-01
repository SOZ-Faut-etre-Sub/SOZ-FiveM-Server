AddStateBagChangeHandler("isSirenMuted", nil, function(bagName, key, value, _, _)
    local entNet = bagName:gsub("entity:", "")

    if key == "isSirenMuted" and type(value) == "boolean" then
        local vehicle = NetToVeh(tonumber(entNet))
        if vehicle ~= 0 then
            SetVehicleHasMutedSirens(vehicle, value)
        end
    end
end)

RegisterKeyMapping("togglesirens", "Sirène - passer du code 3 au code 2", "keyboard", "UP")
RegisterCommand("togglesirens", function()
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)
    local lastState = Entity(vehicle).state.isSirenMuted

    if vehicle ~= 0 then
        Entity(vehicle).state:set("isSirenMuted", not lastState, true)
    end
end, false)

--- Thread
CreateThread(function()
    while true do
        local vehicles = QBCore.Functions.GetVehicles()

        for i = 1, #vehicles do
            if IsVehicleSirenOn(vehicles[i]) then
                local entityModel = GetEntityModel(vehicles[i])

                if Config.SirenVehicle[entityModel] then
                    SetVehicleHasMutedSirens(vehicles[i], Entity(vehicles[i]).state.isSirenMuted)
                end
            end
        end

        Wait(3000)
    end
end)

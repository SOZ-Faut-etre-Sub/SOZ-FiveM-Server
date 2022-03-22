AddStateBagChangeHandler("isSirenMuted", nil, function(bagName, key, value, _, _)
    local entNet = bagName:gsub("entity:", "")

    if key == "isSirenMuted" and type(value) == "boolean" then
        local veh = NetToVeh(tonumber(entNet))
        SetVehicleHasMutedSirens(veh, value)
    end
end)

RegisterKeyMapping("togglesirens", "Sirène - activer les code 2", "keyboard", "2")
RegisterCommand("togglesirens", function()
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)
    local lastState = Entity(vehicle).state.isSirenMuted

    if vehicle then
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

                if Config.RadarAllowedVehicle[entityModel] then
                    SetVehicleHasMutedSirens(vehicles[i], Entity(vehicles[i]).state.isSirenMuted)
                end
            end
        end

        Wait(3000)
    end
end)

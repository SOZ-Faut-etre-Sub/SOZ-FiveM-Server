local vehEng, vehBody = 0, 0

local function DisableVehicle(vehicle, time)
    local tick = 0.0

    -- Set vehicle undriveable
    SetVehicleUndriveable(vehicle, true)

    while tick < time do
        -- disable accelerate and brake
        DisableControlAction(0, 71, true)
        DisableControlAction(0, 72, true)

        if GetIsVehicleEngineRunning(vehicle) then
            SetVehicleEngineOn(vehicle, false, true, false)
        end

        tick = tick + 1.0
        Wait(1)
    end

    -- Set vehicle driveable and restart it
    SetVehicleUndriveable(vehicle, false)
    SetVehicleEngineOn(vehicle, true, false, true)
end

Citizen.CreateThread(function()
    while true do
        local player  = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player, false)

        if IsPedInAnyVehicle(player, 1) and GetPedInVehicleSeat(vehicle, -1) == player then
            local newVehEng, newVehBody = GetVehicleEngineHealth(vehicle), GetVehicleBodyHealth(vehicle)

            if newVehEng + newVehBody <= (vehEng + vehBody) - 30 then
                if vehEng ~= 0.0 and vehBody ~= 0.0 then
                    -- Get all vehicle damages and add random to calculate wait time
                    local wait = (newVehEng / vehEng + newVehBody / vehBody) + math.random(1000, 3000)

                    CreateThread(function()
                        DisableVehicle(vehicle, math.abs(wait))
                    end)
                end
            end

            vehEng, vehBody = newVehEng, newVehBody
        else
            vehEng, vehBody = 0, 0

            Wait(5000)
        end

        Wait(1000)
    end
end)

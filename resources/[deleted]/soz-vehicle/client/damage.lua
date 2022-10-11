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

local function PropertiesToCondition(properties)
    local conditionVehicle = {}
    conditionVehicle["engineHealth"] = properties.engineHealth
    conditionVehicle["tireHealth"] = properties.tireHealth
    conditionVehicle["tankHealth"] = properties.tankHealth
    conditionVehicle["dirtLevel"] = properties.dirtLevel
    conditionVehicle["bodyHealth"] = properties.bodyHealth
    conditionVehicle["oilLevel"] = properties.oilLevel
    conditionVehicle["fuelLevel"] = properties.fuelLevel
    conditionVehicle["windowStatus"] = properties.windowStatus
    conditionVehicle["tireBurstState"] = properties.tireBurstState
    conditionVehicle["tireBurstCompletely"] = properties.tireBurstCompletely
    conditionVehicle["doorStatus"] = properties.doorStatus
    return conditionVehicle
end

exports("PropertiesToCondition", PropertiesToCondition)

Citizen.CreateThread(function()
    while true do
        local player = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player, false)

        if IsPedInAnyVehicle(player, true) and GetPedInVehicleSeat(vehicle, -1) == player then
            local newVehEng, newVehBody = GetVehicleEngineHealth(vehicle), GetVehicleBodyHealth(vehicle)
            if newVehEng + newVehBody <= (vehEng + vehBody) - 300 then
                if newVehEng ~= 0.0 and newVehBody ~= 0.0 then
                    -- Get all vehicle damages and add random to calculate wait time
                    local wait = (vehEng / newVehEng + vehBody / newVehBody) * math.random(150, 200)
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
        Wait(500)
    end
end)

Citizen.CreateThread(function()
    while true do
        local player = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player, false)

        if IsPedInAnyVehicle(player, true) and GetPedInVehicleSeat(vehicle, -1) == player then
            local newVehEng, newVehBody = GetVehicleEngineHealth(vehicle), GetVehicleBodyHealth(vehicle)

            if newVehEng + newVehBody ~= vehEng + vehBody then
                local newcondition = PropertiesToCondition(QBCore.Functions.GetVehicleProperties(vehicle))
                Entity(vehicle).state:set("condition", json.encode(newcondition), true)
            end

            vehEng, vehBody = newVehEng, newVehBody
        end
        Wait(15000)
    end
end)

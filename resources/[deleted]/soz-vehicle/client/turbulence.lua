AddEventHandler("baseevents:enteredVehicle", function(vehicle, seat, displayName, netId)
    local model = GetEntityModel(vehicle)

    if IsThisModelAHeli(model) then
        SetHeliTurbulenceScalar(vehicle, 0.0)
    end

    if IsThisModelAPlane(model) then
        SetPlaneTurbulenceMultiplier(vehicle, 0.0)
    end
end)

AddStateBagChangeHandler("blackout", "global", function(_, _, value, _, _)
    if value == true then
        TriggerEvent("InteractSound_CL:PlayOnOne", "system/blackout", 0.2)
    else
        TriggerEvent("InteractSound_CL:PlayOnOne", "system/unblackout", 0.2)
    end

    SetArtificialLightsState(value)
end)

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end

    SetArtificialLightsState(GlobalState.blackout)
    SetArtificialLightsStateAffectsVehicles(false)
end)

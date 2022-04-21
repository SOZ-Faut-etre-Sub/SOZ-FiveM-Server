AddStateBagChangeHandler("blackout", "global", function(_, _, value, _, _)
    if value == true then
        TriggerEvent("InteractSound_CL:PlayOnOne", "system/blackout", 0.2)
    else
        TriggerEvent("InteractSound_CL:PlayOnOne", "system/unblackout", 0.2)
    end

    SetArtificialLightsState(value)
end)

RegisterNetEvent("onPlayerJoining", function()
    SetArtificialLightsState(GlobalState.blackout)
    SetArtificialLightsStateAffectsVehicles(false)
end)

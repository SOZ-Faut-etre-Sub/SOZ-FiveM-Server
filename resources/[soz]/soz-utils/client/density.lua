local density = {["parked"] = 0.5, ["vehicle"] = 0.80, ["multiplier"] = 0.80, ["peds"] = 0.80, ["scenario"] = 0.80}

CreateThread(function()
    while true do
        SetParkedVehicleDensityMultiplierThisFrame(density["parked"])
        SetVehicleDensityMultiplierThisFrame(density["vehicle"])
        SetRandomVehicleDensityMultiplierThisFrame(density["multiplier"])
        SetPedDensityMultiplierThisFrame(density["peds"])
        SetAmbientPedRangeMultiplierThisFrame(density["peds"])
        SetScenarioPedDensityMultiplierThisFrame(density["scenario"], density["scenario"]) -- Walking NPC Density
        Wait(0)
    end
end)

function DecorSet(Type, Value)
    if Type == "parked" then
        density["parked"] = Value
    elseif Type == "vehicle" then
        density["vehicle"] = Value
    elseif Type == "multiplier" then
        density["multiplier"] = Value
    elseif Type == "peds" then
        density["peds"] = Value
    elseif Type == "scenario" then
        density["scenario"] = Value
    end
end

exports("DecorSet", DecorSet)

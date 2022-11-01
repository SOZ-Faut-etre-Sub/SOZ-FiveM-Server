CreateThread(function()
    while true do
        Wait(1000)
        for vehicle in exports["soz-vehicle"]:EnumerateVehicles() do
            if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 and
                ((IsVehicleEngineOn(vehicle) and GetOil(vehicle) <= 0.5) or GetOil(vehicle) <= 0) then
                exports["soz-vehicle"]:showLoopParticleAtBone("core", "exp_grd_bzgas_smoke", vehicle, GetEntityBoneIndexByName(vehicle, "engine"), 1.5, 1000)
            end
        end
    end
end)

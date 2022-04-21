local function ApplySnowOnMap(snow)
    ForceSnowPass(snow)
    SetForceVehicleTrails(snow)
    SetForcePedFootstepsTracks(snow)

    if snow then
        if not HasNamedPtfxAssetLoaded("core_snow") then
            RequestNamedPtfxAsset("core_snow")

            while not HasNamedPtfxAssetLoaded("core_snow") do
                Wait(0)
            end
        end

        UseParticleFxAssetNextCall("core_snow")
    else
        RemoveNamedPtfxAsset("core_snow")
    end
end

AddStateBagChangeHandler("weather", "global", function(_, _, value, _, _)
    ApplySnowOnMap(Config.WeatherWithSnowOnGround[value] or false)
end)

RegisterNetEvent("onPlayerJoining", function()
    ApplySnowOnMap(Config.WeatherWithSnowOnGround[GlobalState.weather] or false)
end)

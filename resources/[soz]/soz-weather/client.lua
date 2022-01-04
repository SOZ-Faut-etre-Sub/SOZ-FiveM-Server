local currentWeather = nil
local nextWeather = nil
local snowOnGround = false

RegisterNetEvent("soz-weather:sync")
AddEventHandler("soz-weather:sync", function (current, next)
    currentWeather = current
    nextWeather = next
	snowOnGround = current == "blizzard" or current == "snow" or current == "snowlight"

    SetWeatherOwnedByNetwork(false)
    SetWeatherTypeOvertimePersist(current, 10.0)
end)

Citizen.CreateThread(function()
    while true do
        ForceSnowPass(snowOnGround)
        SetForceVehicleTrails(snowOnGround)
        SetForcePedFootstepsTracks(snowOnGround)

        if snowOnGround then
            if not HasNamedPtfxAssetLoaded("core_snow") then
                RequestNamedPtfxAsset("core_snow")

                while not HasNamedPtfxAssetLoaded("core_snow") do
                    Citizen.Wait(0)
                end
            end

            UseParticleFxAssetNextCall("core_snow")
        else
            RemoveNamedPtfxAsset("core_snow")
        end

        Citizen.Wait(1000)
    end
end)

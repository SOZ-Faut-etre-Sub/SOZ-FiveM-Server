local function Shutdown()
    Citizen.CreateThread(function()
        -- Shutdown gta loading screen as it's not needed
        ShutdownLoadingScreen()

        -- Make game screen black
        DoScreenFadeOut(1000)
        Citizen.Wait(1000)

        -- Shutdown our loading screen
        ShutdownLoadingScreenNui(true)

        -- Remove black screen
        DoScreenFadeIn(1000)
        Citizen.Wait(1000)
    end)
end

exports("Shutdown", Shutdown)

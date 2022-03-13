local function Shutdown()
    Citizen.CreateThread(function()
        -- Shutdown gta loading screen as it's not needed
        ShutdownLoadingScreen()

        -- Make game screen black
        DoScreenFadeOut(1000)
        Citizen.Wait(1000)

        while not IsScreenFadedOut() do
            Citizen.Wait(0)
        end

        -- Shutdown our loading screen
        ShutdownLoadingScreenNui(true)

        -- Remove black screen
        DoScreenFadeIn(1000)
        Citizen.Wait(1000)

        while not IsScreenFadedIn() do
            Citizen.Wait(0)
        end
    end)
end

exports("Shutdown", Shutdown)

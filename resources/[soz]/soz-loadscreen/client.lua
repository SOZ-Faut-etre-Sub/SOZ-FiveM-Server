local function Shutdown()
    -- Make game screen black
    DoScreenFadeOut(0)

    while not IsScreenFadedOut() do
        Citizen.Wait(0)
    end

    -- Shutdown the game
    -- SendLoadingScreenMessage(json.encode({
    --    shutdown = true,
    -- }))
    -- Wait(1000)

    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui(true)

    -- Remove black screen
    DoScreenFadeIn(1000)

    while not IsScreenFadedIn() do
        Citizen.Wait(0)
    end
end

exports("Shutdown", Shutdown)

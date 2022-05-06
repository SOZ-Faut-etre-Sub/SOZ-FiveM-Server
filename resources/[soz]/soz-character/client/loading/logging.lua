--- Wait for game to be ready
CreateThread(function()
    while true do
        Wait(50)
        if NetworkIsSessionStarted() then
            local playerPed = PlayerPedId()

            if playerPed and playerPed ~= -1 and NetworkIsPlayerActive(PlayerId()) then
                StartGame()

                return
            end
        end
    end
end)

function StartGame()
    -- Load default player
    local player = QBCore.Functions.TriggerRpc("soz-character:server:GetDefaultPlayer");

    if not player then
        -- Create player process
        CreatePlayer(true)
    else
        -- Load player process
        LogExistingPlayer(player, true)
    end

    local playerPed = PlayerPedId()

    SetPedMaxHealth(playerPed, 200)
    SetPedSuffersCriticalHits(playerPed, false)
end

function LogExistingPlayer(player, shutdownLoadingScreen)
    -- First freeze user position to avoid character movement
    FreezeEntityPosition(PlayerPedId(), true)
    SetEntityVisible(PlayerPedId(), false)
    SetEntityCollision(PlayerPedId(), false)
    ClearPedTasksImmediately(PlayerPedId())
    SetPlayerInvincible(PlayerId(), true)

    -- Login player into server (qbcore)
    local playerObject = QBCore.Functions.TriggerRpc("soz-character:server:LoginPlayer", player)

    ApplyPlayerBodySkin(PlayerId(), playerObject.PlayerData.skin)
    ApplyPlayerClothConfig(PlayerId(), playerObject.PlayerData.cloth_config)

    local playerPed = PlayerPedId()

    -- Default player state
    SetEntityCoordsNoOffset(playerPed, playerObject.PlayerData.position.x, playerObject.PlayerData.position.y, playerObject.PlayerData.position.z, false, false,
                            false, true)
    NetworkResurrectLocalPlayer(playerObject.PlayerData.position.x, playerObject.PlayerData.position.y, playerObject.PlayerData.position.z, 0, true, true, false)
    ClearPedTasksImmediately(playerPed)
    SetBlockingOfNonTemporaryEvents(playerPed, true)

    for height = playerObject.PlayerData.position.z, 1000 do
        local found, z = GetGroundZFor_3dCoord_2(playerObject.PlayerData.position.x, playerObject.PlayerData.position.y, height + 0.0)

        if found then
            SetPedCoordsKeepVehicle(playerPed, playerObject.PlayerData.position.x, playerObject.PlayerData.position.y, z)
            break
        end

        Wait(0)
    end

    SetEntityHealth(playerPed, playerObject.PlayerData.metadata["health"])

    while not HasCollisionLoadedAroundEntity(playerPed) do
        Wait(0)
    end

    -- Make player visible
    SetFocusEntity(PlayerPedId())
    FreezeEntityPosition(PlayerPedId(), false)
    SetEntityVisible(PlayerPedId(), true)

    -- Shutdown loading screen
    if shutdownLoadingScreen then
        exports["soz-loadscreen"]:Shutdown()
    end

    -- Display ui and trigger last events
    TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
    TriggerEvent("QBCore:Client:OnPlayerLoaded")
end

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
end

function LogExistingPlayer(player, shutdownLoadingScreen)
    -- First freeze user position to avoid character movement
    FreezeEntityPosition(PlayerPedId(), true)
    SetEntityVisible(PlayerPedId(), false)
    SetEntityCollision(PlayerPedId(), false)
    ClearPedTasksImmediately(PlayerPedId())
    SetPlayerInvincible(PlayerId(), true)

    -- Login player into server (qbcore)
    TriggerServerEvent("soz-character:server:LoginPlayer", player)

    -- Load player skin
    local playerSkin = QBCore.Functions.TriggerRpc("soz-character:server:GetPlayerSkin", player.citizenid)

    if playerSkin == nil then
        -- @TODO weird case here should never happen but protective coding prevail
    end

    local model = tonumber(playerSkin.model)
    local skin = json.decode(playerSkin.skin)

    -- Load player model
    RequestModel(model)
    while not HasModelLoaded(model) do
        Wait(10)
    end

    -- Create player ped
    local playerData = QBCore.Functions.GetPlayerData();

    -- Attach model to player
    SetPlayerModel(PlayerId(), model)
    SetModelAsNoLongerNeeded(model)

    local playerPed = PlayerPedId()

    -- Default player state
    SetEntityCoordsNoOffset(playerPed, playerData.position.x, playerData.position.y, playerData.position.z, false, false, false, true)
    NetworkResurrectLocalPlayer(playerData.position.x, playerData.position.y, playerData.position.z, 0, true, true, false)
    ClearPedTasksImmediately(playerPed)
    SetPedComponentVariation(playerPed, 0, 0, 0, 2)
    PlaceObjectOnGroundProperly(playerPed)
    SetBlockingOfNonTemporaryEvents(playerPed, true)

    -- Load player skin
    TriggerEvent("cui_character:loadClothes", skin, playerPed)

    -- @TODO Make load cloth a rpc call to avoid random wait here
    Wait(1000)

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

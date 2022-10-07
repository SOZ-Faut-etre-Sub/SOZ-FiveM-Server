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

DefaultSkin = json.decode(
                  "{\"Tattoos\":[],\"Makeup\":{\"LipstickOpacity\":1.0,\"BlushType\":-1,\"FullMakeupType\":-1,\"BlushColor\":0,\"LipstickType\":-1,\"FullMakeupDefaultColor\":true,\"FullMakeupOpacity\":1.0,\"BlushOpacity\":1.0,\"FullMakeupPrimaryColor\":0,\"LipstickColor\":0,\"FullMakeupSecondaryColor\":0},\"Hair\":{\"ChestHairType\":-1,\"EyebrowColor\":0,\"ChestHairColor\":0,\"BeardType\":-1,\"HairType\":0,\"HairSecondaryColor\":0,\"EyebrowOpacity\":1.0,\"BeardOpacity\":1.0,\"HairColor\":0,\"BeardColor\":0,\"ChestHairOpacity\":1.0,\"EyebrowType\":-1},\"FaceTrait\":{\"NoseWidth\":0.0,\"CheeksBoneWidth\":0.0,\"CheeksBoneHigh\":0.0,\"NoseBoneHigh\":0.0,\"NosePeakLower\":0.0,\"BodyBlemish\":-1,\"ChimpBoneWidth\":0.0,\"AddBodyBlemish\":-1,\"EyesOpening\":0.0,\"NosePeakHeight\":0.0,\"NosePeakLength\":0.0,\"Complexion\":-1,\"EyebrowForward\":0.0,\"JawBoneBackLength\":0.0,\"EyebrowHigh\":0.0,\"EyeColor\":-1,\"ChimpBoneLower\":0.0,\"LipsThickness\":0.0,\"ChimpHole\":0.0,\"Blemish\":-1,\"CheeksWidth\":0.0,\"JawBoneWidth\":0.0,\"NoseBoneTwist\":0.0,\"NeckThickness\":0.0,\"ChimpBoneLength\":0.0,\"Moles\":-1,\"Ageing\":-1},\"Model\":{\"Father\":0,\"Mother\":23,\"ShapeMix\":0.5,\"SkinMix\":0.5,\"Hash\":1885233650}}")
DefaultClothConfig = json.decode(
                         "{\"BaseClothSet\":{\"Props\":[],\"Components\":[{\"Drawable\":0,\"Palette\":0,\"Texture\":0},null,{\"Drawable\":15,\"Palette\":0,\"Texture\":0},{\"Drawable\":14,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":34,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":15,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":91,\"Palette\":0,\"Texture\":0}]},\"NakedClothSet\":{\"Props\":[],\"Components\":[{\"Drawable\":0,\"Palette\":0,\"Texture\":0},null,{\"Drawable\":15,\"Palette\":0,\"Texture\":0},{\"Drawable\":61,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":34,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":15,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":0,\"Palette\":0,\"Texture\":0},{\"Drawable\":15,\"Palette\":0,\"Texture\":0}]},\"Config\":{\"ShowHelmet\":false,\"HideGlasses\":false,\"HideLeftHand\":false,\"HideBulletproof\":false,\"HideTop\":false,\"HidePants\":false,\"Naked\":false,\"HideChain\":false,\"HideBag\":false,\"HideHead\":false,\"HideRightHand\":false,\"HideMask\":false,\"HideEar\":false,\"HideShoes\":false}}")
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
    SetPedConfigFlag(playerPed, 35, false)
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

    if (playerObject.PlayerData.skin.length == 0) then
        playerObject.PlayerData.skin = DefaultSkin
    end
    ApplyPlayerBodySkin(PlayerId(), playerObject.PlayerData.skin)
    if (playerObject.PlayerData.cloth_config.length == 0) then
        playerObject.PlayerData.cloth_config = DefaultClothConfig
    end

    ApplyPlayerClothConfig(PlayerId(), playerObject.PlayerData.cloth_config)

    local playerPed = PlayerPedId()

    -- Default player state
    SetEntityCoordsNoOffset(playerPed, playerObject.PlayerData.position.x, playerObject.PlayerData.position.y, playerObject.PlayerData.position.z, false, false,
                            false, true)
    NetworkResurrectLocalPlayer(playerObject.PlayerData.position.x, playerObject.PlayerData.position.y, playerObject.PlayerData.position.z, 0, true, true, false)
    ClearPedTasksImmediately(playerPed)
    SetBlockingOfNonTemporaryEvents(playerPed, true)

    SetEntityHealth(playerPed, playerObject.PlayerData.metadata["health"])
    SetPedArmour(playerPed, playerObject.PlayerData.metadata["armor"].current)

    while not HasCollisionLoadedAroundEntity(playerPed) do
        Wait(0)
    end

    -- Ensure player is on ground
    SetEntityCoordsNoOffset(playerPed, playerObject.PlayerData.position.x, playerObject.PlayerData.position.y, playerObject.PlayerData.position.z, false, false,
                            false, true)

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

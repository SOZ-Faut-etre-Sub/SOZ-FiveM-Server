function CreatePlayer(shutdownLoadingScreen)
    ---- Shutdown Loading Screen
    if shutdownLoadingScreen then
        exports["soz-loadscreen"]:Shutdown()
    end

    -- Camera effect
    ClearScreen()
    StartUnzoomSkyCam()
    StopUnzoomSkyCam()
    StartZoomSkyCam()

    -- Select spawn on NUI
    SetNuiFocus(true, true)
    SendNUIMessage({action = "open"})

    -- set God mode
    TriggerServerEvent("soz-character:server:InCharacterMenu", true)
end

RegisterNUICallback("SpawnPlayer", function(data)
    -- Player has choose the spawn
    SetNuiFocus(false, false)
    SendNUIMessage({action = "close"})

    local charInfo, character = CharacterPrepare()

    SpawnPlayer(data.SpawnId)
    CharacterCreate(data.SpawnId, charInfo, character)
end)

function SpawnPlayer(SpawnId, skipFocusArea)
    if skipFocusArea ~= true then
        SetFocusArea(Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"],
                     Config.Locations[SpawnId]["Coords"]["Z"] + Config.Locations[SpawnId]["Coords"]["Z-Offset"], 0.0, 0.0, 0.0)
    end

    SetEntityCoords(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"], Config.Locations[SpawnId]["Coords"]["Z"],
                    0, 0, 0, false)
    SetEntityHeading(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["H"])
    SetPedMaxHealth(PlayerPedId(), 200)

    Citizen.Wait(1000)
    StopZoomSkyCam()
end

function CharacterPrepare()
    local account = QBCore.Functions.TriggerRpc("soz-character:server:GetUserAccount")
    local charInfo = {}

    if account ~= nil then
        charInfo.firstname = account.name
        charInfo.lastname = account.lastName
    end

    local character = CreateAndApplyDefaultCharacter(0)

    return charInfo, character
end

function CharacterCreate(SpawnId, charInfo, character)
    local playerPed = PlayerPedId()

    FreezeEntityPosition(playerPed, true)
    SetEntityVisible(playerPed, true)
    SetNuiFocus(false, false)

    -- Create character with menu (or other interface
    character = CreateCharacterWizard(SpawnId, character)

    -- Winter
    -- character.ClothConfig.BaseClothSet.Components[ComponentType.Chain] = GetHashKey("mp_m_freemode_01") == character.Skin.Model.Hash and
    --                                                                         {Drawable = 35, Texture = 1, Palette = 0} or
    --                                                                         {Drawable = 18, Texture = 1, Palette = 0}
    -- character.ClothConfig.BaseClothSet.Props[tostring(PropType.Head)] = GetHashKey("mp_m_freemode_01") == character.Skin.Model.Hash and
    --                                                                        {Drawable = 98, Texture = 0, Palette = 0} or
    --                                                                        {Drawable = 97, Texture = 0, Palette = 0}

    -- Meteor
    -- character.ClothConfig.BaseClothSet.Components[tostring(ComponentType.Mask)] = {
    --     Drawable = 175,
    --     Texture = 0,
    --     Palette = 0,
    -- }
    -- character.ClothConfig.Config.HideMask = true

    local connected = QBCore.Functions.TriggerRpc("soz-character:server:CreatePlayer", charInfo, character.Skin, character.ClothConfig);

    if connected then
        SetEntityVisible(PlayerPedId(), true)
        SetNuiFocus(false, false)

        TriggerEvent("QBCore:Client:OnPlayerLoaded")

        ApplyPlayerBodySkin(PlayerId(), character.Skin)
        ApplyPlayerClothConfig(PlayerId(), character.ClothConfig)
    end

    DoScreenFadeIn(500)
end

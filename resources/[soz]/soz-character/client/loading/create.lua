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
end

RegisterNUICallback("SpawnPlayer", function(data)
    -- Player has choose the spawn
    SetNuiFocus(false, false)
    SendNUIMessage({action = "close"})

    local charInfo, character = CharacterPrepare()

    SpawnPlayer(data.SpawnId)
    CharacterCreate(data.SpawnId, charInfo, character)
end)

function SpawnPlayer(SpawnId)
    SetFocusArea(Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"],
                 Config.Locations[SpawnId]["Coords"]["Z"] + Config.Locations[SpawnId]["Coords"]["Z-Offset"], 0.0, 0.0, 0.0)
    SetEntityCoords(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"], Config.Locations[SpawnId]["Coords"]["Z"],
                    0, 0, 0, false)
    SetEntityHeading(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["H"])

    Citizen.Wait(1000)
    StopZoomSkyCam()
end

function CharacterPrepare()
    local charInfo = QBCore.Functions.TriggerRpc("soz-character:server:GetUserTempPlayer")

    if charInfo == nil then
        charInfo = {gender = 0}
    end

    if charInfo.gender == "Homme" then
        charInfo.gender = 0
    elseif charInfo.gender == "Femme" then
        charInfo.gender = 1
    end

    local character = CreateAndApplyDefaultCharacter(charInfo.gender)

    return charInfo, character
end

function CharacterCreate(SpawnId, charInfo, character)
    local playerPed = PlayerPedId()

    SetEntityVisible(playerPed, true)
    SetNuiFocus(false, false)

    -- Create character with menu (or other interface
    character = CreateCharacterWizard(SpawnId, character)

    local connected = QBCore.Functions.TriggerRpc("soz-character:server:CreatePlayer", charInfo, character.Skin, character.ClothConfig);

    if connected then
        SetEntityVisible(PlayerPedId(), true)
        SetNuiFocus(false, false)

        TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
        TriggerEvent("QBCore:Client:OnPlayerLoaded")

        ApplyPlayerBodySkin(PlayerId(), character.Skin)
        ApplyPlayerClothConfig(PlayerId(), character.ClothConfig)
    end
end

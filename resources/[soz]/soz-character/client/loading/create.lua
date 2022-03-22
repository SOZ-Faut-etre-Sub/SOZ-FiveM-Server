function CreatePlayer(shutdownLoadingScreen)
    ---- Shutdown Loading Screen
    if shutdownLoadingScreen then
        exports["soz-loadscreen"]:Shutdown()
    end

    local SpawnId = "spawn1"

    SpawnPlayer(SpawnId)
    CreateCharacter(SpawnId)

    ---- Camera effect
    -- ClearScreen()
    -- StartUnzoomSkyCam()
    -- StopUnzoomSkyCam()
    -- StartZoomSkyCam()
    --
    ---- Select spawn on NUI
    -- SetNuiFocus(true, true)
    -- SendNUIMessage({action = "open"})
    -- NewCharacterCreate()
end

RegisterNUICallback("SpawnPlayer", function(data)
    -- Player has choose the spawn
    SetNuiFocus(false, false)
    SendNUIMessage({action = "close"})

    SpawnPlayer(data.SpawnId)
end)

function SpawnPlayer(SpawnId)
    SetFocusArea(Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"],
                 Config.Locations[SpawnId]["Coords"]["Z"] + Config.Locations[SpawnId]["Coords"]["Z-Offset"], 0.0, 0.0, 0.0)
    SetEntityCoords(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"], Config.Locations[SpawnId]["Coords"]["Z"],
                    0, 0, 0, false)
    SetEntityHeading(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["H"])

    Citizen.Wait(1000)
    StopZoomSkyCam()

    local tmpCharacter = QBCore.Functions.TriggerCallback("soz-character:server:GetUserTempPlayer")

    if tmpCharacter == nil then
        tmpCharacter = {}
    end

    if tmpCharacter.gender == "Homme" then
        tmpCharacter.gender = 0
    elseif tmpCharacter.gender == "Femme" then
        tmpCharacter.gender = 1
    end

    NewCharacterCreate(SpawnId)
end

-- function LegacyCuiCreate()
--    TriggerServerEvent("soz-character:server:CreatePlayer", tmpCharacter)
--    TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
-- end

function NewCharacterCreate(SpawnId)
    local playerPed = PlayerPedId()
    SetEntityVisible(playerPed, true)

    -- SetFocusEntity(playerPed)
    -- FreezeEntityPosition(playerPed, false)
    -- FreezePedCameraRotation(playerPed, false)
    -- FreezeEntityPosition(playerPed, false)
    -- DestroyAllCams(1)
    -- ClearPedTasksImmediately(playerPed)
    -- SetPedComponentVariation(playerPed, 0, 0, 0, 2)
    -- PlaceObjectOnGroundProperly(playerPed)
    -- SetBlockingOfNonTemporaryEvents(playerPed, true)
    -- RenderScriptCams(false, true, 500, true, true)

    -- print("yolo")

    -- Camera.Deactivate()
    CreateCharacter(SpawnId)

end

RegisterNetEvent("soz-character:client:ChoosePlayerSkin", function()
    SetEntityVisible(PlayerPedId(), true)
    SetNuiFocus(false, false)
    TriggerEvent("QBCore:Client:OnPlayerLoaded")
    TriggerEvent("cui_character:open", {"identity", "features", "style", "spawn"}, false)
end)

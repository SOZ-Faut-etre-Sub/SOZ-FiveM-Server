local Cam = nil
local Cam2 = nil
local charPed = nil
local QBCore = exports["qb-core"]:GetCoreObject()
local cloudOpacity = 0.01
local muteSound = true

------- Loading -------

function ToggleSound(state)
    if state then
        StartAudioScene("MP_LEADERBOARD_SCENE");
    else
        StopAudioScene("MP_LEADERBOARD_SCENE");
    end
end

function InitialSetup()
    SetManualShutdownLoadingScreenNui(true)
    ToggleSound(muteSound)
end

function ClearScreen()
    SetCloudHatOpacity(cloudOpacity)
    HideHudAndRadarThisFrame()
    ClearCloudHat()
    ClearOverrideWeather()
end

InitialSetup()
CreateThread(function()
    while true do
        Wait(0)
        if NetworkIsSessionStarted() then
            InitialSetup()
            SetSkyCamLoading(true)
            ShutdownLoadingScreen()
            ShutdownLoadingScreenNui()
            ClearScreen()
            ToggleSound(false)
            ClearDrawOrigin()
            TriggerEvent("soz-character:client:choose:spawn")
            return
        end
    end
end)

-----------------------

RegisterNetEvent("soz-character:client:choose:spawn")
AddEventHandler("soz-character:client:choose:spawn", function()
    Citizen.SetTimeout(450, function()
        SetSkyCamLoading(false)
        SetEntityVisible(PlayerPedId(), false)
        SetSkyCam(true)
        TriggerEvent("soz-character:client:NcDataPed")
    end)
end)

RegisterNUICallback("SpawnPlayer", function(data)
    Citizen.Wait(2000)
    SpawnPlayer(data.SpawnId)
end)

RegisterNUICallback("SpawnJail", function(data)
    DoScreenFadeOut(250)
    Citizen.Wait(100)
    SetSkyCam(false)
    TriggerEvent("QBCore:Client:OnPlayerLoaded")
    TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
    Citizen.Wait(100)
    TriggerEvent("prison:client:spawn:prison")
end)

RegisterNUICallback("Close", function()
    SetNuiFocus(false, false)
end)

RegisterNUICallback("Click", function()
    PlaySound(-1, "CLICK_BACK", "WEB_NAVIGATION_SOUNDS_PHONE", 0, 0, 1)
end)

function SetSkyCamLoading(bool)
    if bool then
        DisplayRadar(false)
        Cam2 = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -421.0049, 1155.414, 324.8574 + 100, -85.00, 0.00, 260.00, 100.00, false, 0)
        SetCamActive(Cam2, true)
        SetFocusArea(-421.0049, 1155.414, 324.8574 + 10, 50, 0.0, 0.0)
        ShakeCam(Cam2, "HAND_SHAKE", 0.15)
        SetEntityVisible(PlayerPedId(), false)
        RenderScriptCams(true, false, 3000, 1, 1)
        Citizen.Wait(2000)
        SetFocusArea(-265.51, -811.01, 31.85 + 175, 0.0, 0.0, 0.0)
        SetCamParams(Cam2, -400.00, 1700.00, 31.85 + 3000, -85.00, 0.00, 260.00, 100.0, 5000, 0, 0, 2)
        SetEntityCoords(PlayerPedId(), -421.0049, 1155.414, 324.8574 - 0.9, 0, 0, 0, false)
        SetEntityHeading(PlayerPedId(), 80)
        Citizen.Wait(4500)
    else
        if DoesCamExist(Cam2) then
            RenderScriptCams(false, true, 500, true, true)
            SetCamActive(Cam2, false)
            DestroyCam(Cam2, true)
        end
    end
end

function SetSkyCam(bool)
    if bool then
        ClearCloudHat()
        ClearOverrideWeather()
        Cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -400.00, 1700.00, 31.85 + 3000, -85.00, 0.00, 260.00, 100.00, false, 0)
        SetCamActive(Cam, true)
        SetFocusArea(-265.51, -811.01, 31.85 + 175, 0.0, 0.0, 0.0)
        ShakeCam(Cam, "HAND_SHAKE", 0.15)
        SetEntityVisible(PlayerPedId(), false)
        RenderScriptCams(true, false, 3000, 1, 1)
    else
        if DoesCamExist(Cam) then
            RenderScriptCams(false, true, 500, true, true)
            SetCamActive(Cam, false)
            DestroyCam(Cam, true)
        end
        SetFocusEntity(PlayerPedId())
        FreezeEntityPosition(PlayerPedId(), false)
        SetEntityVisible(PlayerPedId(), true)
    end
end

function SpawnPlayer(SpawnId)
    SetFocusArea(Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"],
                 Config.Locations[SpawnId]["Coords"]["Z"] + Config.Locations[SpawnId]["Coords"]["Z-Offset"], 0.0, 0.0, 0.0)
    SetCamParams(Cam, Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"],
                 Config.Locations[SpawnId]["Coords"]["Z"] + Config.Locations[SpawnId]["Coords"]["Z-Offset"], Config.Locations[SpawnId]["Coords"]["XR"], 0.00,
                 0.00, 100.0, 5000, 0, 0, 2)
    SetEntityCoords(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"],
                    Config.Locations[SpawnId]["Coords"]["Z"] - 0.9, 0, 0, 0, false)
    SetEntityHeading(PlayerPedId(), Config.Locations[SpawnId]["Coords"]["H"])
    Citizen.Wait(4500)
    if SpawnId == "spawn2" then
        SetFocusArea(Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"], Config.Locations[SpawnId]["Coords"]["Z"] + 10, 0.0,
                     0.0, 0.0)
        SetCamParams(Cam, Config.Locations[SpawnId]["Coords"]["X"], Config.Locations[SpawnId]["Coords"]["Y"], Config.Locations[SpawnId]["Coords"]["Z"] + 10,
                     -40.0, 0.00, 0.00, 100.0, 5000, 0, 0, 2)
        Citizen.Wait(4500)
    end
    Citizen.SetTimeout(1000, function()
        SetSkyCam(false)
        Citizen.Wait(100)
        DoScreenFadeOut(250)
        Citizen.Wait(150)
        SetSkyCam(false)
        Citizen.Wait(1000)
        DoScreenFadeIn(1000)
    end)
    QBCore.Functions.TriggerCallback("soz-character:server:GetUserTempCharacters", function(result2)
        local tmpUser = result2[1];
        if tmpUser == nil then
            tmpUser = {}
        end
        TriggerEvent("soz-character:client:createNewCharacter", tmpUser)
    end)
    TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
end

-- Events

RegisterNetEvent("soz-character:client:closeNUIdefault", function()
    SetNuiFocus(false, false)
    TriggerEvent("QBCore:Client:OnPlayerLoaded")
    -- TriggerEvent('qb-weathersync:client:EnableSync')
    TriggerEvent("cui_character:open", {"identity", "features", "style", "spawn"}, false)
end)

RegisterNetEvent("soz-character:client:NcDataPed", function()
    SetEntityAsMissionEntity(charPed, true, true)
    DeleteEntity(charPed)
    QBCore.Functions.TriggerCallback("soz-character:server:GetUserCharacters", function(result)
        if result[1] ~= nil then
            local cData = result[1]
            TriggerServerEvent("soz-character:server:loadUserData", cData)
            local data = cData
            data.cid = cData.citizenid
            QBCore.Functions.TriggerCallback("soz-character:server:getSkin", function(model, data)
                model = model ~= nil and tonumber(model) or false
                if model ~= nil then
                    CreateThread(function()
                        RequestModel(model)
                        while not HasModelLoaded(model) do
                            Wait(10)
                        end
                        charPed = CreatePed(2, model, Config.PedCoords.x, Config.PedCoords.y, Config.PedCoords.z - 0.98, Config.PedCoords.w, false, true)
                        SetPedComponentVariation(charPed, 0, 0, 0, 2)
                        FreezeEntityPosition(charPed, false)
                        SetEntityInvincible(charPed, true)
                        PlaceObjectOnGroundProperly(charPed)
                        SetBlockingOfNonTemporaryEvents(charPed, true)
                        data = json.decode(data)
                        TriggerEvent("cui_character:loadClothes", data, charPed)
                        QBCore.Functions.GetPlayerData(function(PlayerData)
                            SetEntityCoords(PlayerPedId(), PlayerData.position.x, PlayerData.position.y, PlayerData.position.z - 0.9, 0, 0, 0, false)
                            SetFocusArea(PlayerData.position.x, PlayerData.position.y, PlayerData.position.z + 300, 0.0, 0.0, 0.0)
                            SetCamParams(Cam, PlayerData.position.x, PlayerData.position.y, PlayerData.position.z + 300, -85.0, 0.00, 0.00, 100.0, 5000, 0, 0, 2)
                            Citizen.Wait(4500)
                            SetFocusArea(PlayerData.position.x, PlayerData.position.y, PlayerData.position.z + 10, 0.0, 0.0, 0.0)
                            SetCamParams(Cam, PlayerData.position.x, PlayerData.position.y, PlayerData.position.z + 10, -40.0, 0.00, 0.00, 100.0, 5000, 0, 0, 2)
                            Citizen.Wait(4500)
                            Citizen.SetTimeout(1000, function()
                                SetSkyCam(false)
                                Citizen.Wait(100)
                                DoScreenFadeOut(250)
                                Citizen.Wait(150)
                                SetSkyCam(false)
                                Citizen.Wait(1000)
                                DoScreenFadeIn(1000)
                            end)
                        end)
                        DisplayRadar(true)
                        TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
                        TriggerEvent("QBCore:Client:OnPlayerLoaded")
                    end)
                end
            end)
        else
            local PlayerData = QBCore.Functions.GetPlayerData()
            local InJail = false
            SetNuiFocus(true, true)
            SendNUIMessage({action = "spawn", injail = InJail})
        end
    end)
end)

RegisterNetEvent("soz-character:client:createNewCharacter", function(cData2)
    local cData = cData2
    DoScreenFadeOut(150)
    if cData.gender == "Homme" then
        cData.gender = 0
    elseif cData.gender == "Femme" then
        cData.gender = 1
    end
    TriggerServerEvent("soz-character:server:createCharacter", cData)
    Wait(500)
end)

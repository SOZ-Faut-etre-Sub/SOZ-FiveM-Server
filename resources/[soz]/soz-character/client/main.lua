local cam = nil
local charPed = nil
local QBCore = exports["qb-core"]:GetCoreObject()

-- Main Thread

CreateThread(function()
    while true do
        Wait(0)
        if NetworkIsSessionStarted() then
            TriggerEvent("soz-character:client:chooseChar")
            return
        end
    end
end)

-- Events

RegisterNetEvent("soz-character:client:closeNUIdefault", function()
    local src = source
    DeleteEntity(charPed)
    SetNuiFocus(false, false)
    DoScreenFadeOut(500)
    Wait(2000)
    SetEntityCoords(PlayerPedId(), Config.DefaultSpawn.x, Config.DefaultSpawn.y, Config.DefaultSpawn.z)
    TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
    TriggerEvent("QBCore:Client:OnPlayerLoaded")
    Wait(500)
    SetEntityVisible(PlayerPedId(), true)
    Wait(500)
    DoScreenFadeIn(250)
    -- TriggerEvent('qb-weathersync:client:EnableSync')
    TriggerEvent("cui_character:open", {"identity", "features", "style", "apparel"}, false)
end)

RegisterNetEvent("soz-character:client:chooseChar", function()
    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
    SetTimecycleModifier("default")
    TriggerEvent("soz-character:client:NcDataPed")
end)

-- A METTRE QUAND UN PERSO EST DEJA CREE POUR LOAD

RegisterNetEvent("soz-character:client:selectCharacter", function(data)
    DoScreenFadeOut(10)
    TriggerServerEvent("soz-character:server:loadUserData", data)
    SetEntityAsMissionEntity(charPed, true, true)
    DeleteEntity(charPed)
end)

RegisterNetEvent("soz-character:client:NcDataPed", function(source)
    SetEntityAsMissionEntity(charPed, true, true)
    DeleteEntity(charPed)
    QBCore.Functions.TriggerCallback("soz-character:server:GetUserCharacters", function(result)
        if result[1] ~= nil then
            local license = result[1].license
            local cData = result[1]
            TriggerServerEvent("soz-character:server:loadUserData", cData)
            -- Check if the license has already a character
            local data = cData
            data.cid = cData.citizenid
            QBCore.Functions.TriggerCallback("soz-character:server:getSkin", function(model, data)
                model = model ~= nil and tonumber(model) or false
                if model ~= nil then
                    CreateThread(function()
                        RequestModel(model)
                        while not HasModelLoaded(model) do
                            Wait(0)
                        end
                        charPed = CreatePed(2, model, Config.PedCoords.x, Config.PedCoords.y, Config.PedCoords.z - 0.98,
                                            Config.PedCoords.w, false, true)
                        SetPedComponentVariation(charPed, 0, 0, 0, 2)
                        FreezeEntityPosition(charPed, false)
                        SetEntityInvincible(charPed, true)
                        PlaceObjectOnGroundProperly(charPed)
                        SetBlockingOfNonTemporaryEvents(charPed, true)
                        data = json.decode(data)
                        TriggerEvent("cui_character:loadClothes", data, charPed)
                        local PlayerData = QBCore.Functions.GetPlayerData()
                        DoScreenFadeOut(500)
                        Wait(2000)
                        QBCore.Functions.GetPlayerData(function(PlayerData)
                            SetEntityCoords(PlayerPedId(), PlayerData.position.x, PlayerData.position.y,
                                            PlayerData.position.z)
                            SetEntityHeading(PlayerPedId(), PlayerData.position.a)
                            FreezeEntityPosition(PlayerPedId(), false)
                        end)
                        TriggerServerEvent("QBCore:Server:OnPlayerLoaded")
                        TriggerEvent("QBCore:Client:OnPlayerLoaded")
                        FreezeEntityPosition(ped, false)
                        RenderScriptCams(false, true, 500, true, true)
                        SetCamActive(cam, false)
                        DestroyCam(cam, true)
                        SetCamActive(cam2, false)
                        DestroyCam(cam2, true)
                        SetEntityVisible(PlayerPedId(), true)
                        Wait(500)
                        DoScreenFadeIn(250)
                    end)
                end
            end)
        else
            QBCore.Functions.TriggerCallback("soz-character:server:GetUserTempCharacters", function(result2)
                local tmpUser = result2[1];

                if tmpUser == nil then
                    -- @TODO-Release Remove this block, disconnect user, and throw error
                    -- force empty, qb create default value if needed
                    tmpUser = {}
                end

                TriggerEvent("soz-character:client:createNewCharacter", tmpUser)
                CreateThread(function()
                    local randommodels = {"mp_m_freemode_01", "mp_f_freemode_01"}
                    local model = GetHashKey(randommodels[math.random(1, #randommodels)])
                    RequestModel(model)
                    while not HasModelLoaded(model) do
                        Wait(0)
                    end
                    charPed = CreatePed(2, model, Config.PedCoords.x, Config.PedCoords.y, Config.PedCoords.z - 0.98,
                                        Config.PedCoords.w, false, true)
                    SetPedComponentVariation(charPed, 0, 0, 0, 2)
                    FreezeEntityPosition(charPed, false)
                    SetEntityInvincible(charPed, true)
                    PlaceObjectOnGroundProperly(charPed)
                    SetBlockingOfNonTemporaryEvents(charPed, true)
                end)
            end)
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

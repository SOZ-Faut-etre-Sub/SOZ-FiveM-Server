local haveItem = false
local radioOpen, radioEnabled, radioProp = false, false, nil
local primaryRadio, secondaryRadio = nil, nil

--- Functions
local function toggleRadioAnimation(pState)
    QBCore.Functions.RequestAnimDict("cellphone@")
    if pState then
        TriggerEvent("attachItemRadio", "radio01")
        TaskPlayAnim(PlayerPedId(), "cellphone@", "cellphone_text_read_base", 2.0, 3.0, -1, 49, 0, 0, 0, 0)
        radioProp = CreateObject(GetHashKey("prop_cs_hand_radio"), 1.0, 1.0, 1.0, 1, 1, 0)
        SetNetworkIdCanMigrate(ObjToNet(radioProp), false)
        AttachEntityToEntity(radioProp, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), 57005), 0.14, 0.01, -0.02, 110.0, 120.0, -15.0, 1, 0, 0, 0, 2, 1)
    else
        StopAnimTask(PlayerPedId(), "cellphone@", "cellphone_text_read_base", 1.0)
        ClearPedTasks(PlayerPedId())
        if radioProp ~= nil then
            DeleteObject(radioProp)
            radioProp = nil
        end
    end
end

local function powerOnRadio()
    exports["soz-voip"]:SetRadioShortRangePowerState(true)
    if primaryRadio then
        TriggerServerEvent("voip:server:radio:connect", "radio-sr", "primary", primaryRadio, "primary")
    end
    if secondaryRadio then
        TriggerServerEvent("voip:server:radio:connect", "radio-sr", "secondary", secondaryRadio, "secondary")
    end
end
local function powerOffRadio()
    if primaryRadio then
        TriggerServerEvent("voip:server:radio:disconnect", "radio-sr", primaryRadio, "primary")
    end
    if secondaryRadio then
        TriggerServerEvent("voip:server:radio:disconnect", "radio-sr", secondaryRadio, "secondary")
    end
    exports["soz-voip"]:SetRadioShortRangePowerState(false)
end
RegisterNetEvent("soz-talk:client:PowerOffRadio", function()
    powerOffRadio()
end)

local function toggleRadio(toggle)
    radioOpen = toggle
    SetNuiFocus(radioOpen, radioOpen)
    SetNuiFocusKeepInput(radioOpen)

    if radioOpen then
        toggleRadioAnimation(true)
        SendNUIMessage({type = "radio", action = "open"})

        TriggerEvent("talk:action:disable")
    else
        toggleRadioAnimation(false)
        SendNUIMessage({type = "radio", action = "close"})

        TriggerEvent("talk:action:enable")
    end
end

--- NUI
RegisterNUICallback("radio/toggle", function(data, cb)
    toggleRadio(data.state)
    cb("ok")
end)

RegisterNUICallback("radio/enable", function(data, cb)
    radioEnabled = data.state
    if radioEnabled then
        powerOnRadio()
    else
        powerOffRadio()
    end
    SoundProvider.toggle()
    cb("ok")
end)

RegisterNUICallback("radio/change_frequency", function(data, cb)
    if not radioEnabled then
        cb("nok")
        return
    end
    if data.primary and tonumber(data.primary) >= Config.Radio.min and tonumber(data.primary) <= Config.Radio.max then
        if data.primary ~= primaryRadio and primaryRadio ~= nil then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-sr", primaryRadio, "primary")
        end

        TriggerServerEvent("voip:server:radio:connect", "radio-sr", "primary", data.primary)
        SoundProvider.default(0.5)

        primaryRadio = data.primary
        cb("ok")
        return
    end
    if data.secondary and tonumber(data.secondary) >= Config.Radio.min and tonumber(data.secondary) <= Config.Radio.max then
        if data.secondary ~= secondaryRadio and secondaryRadio ~= nil then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-sr", secondaryRadio, "secondary")
        end

        TriggerServerEvent("voip:server:radio:connect", "radio-sr", "secondary", data.secondary)
        SoundProvider.default(0.5)

        secondaryRadio = data.secondary
        cb("ok")
        return
    end
    cb("nok")
end)

RegisterNUICallback("radio/change_ear", function(data, cb)
    if not radioEnabled then
        cb("nok")
        return
    end
    if data.primary and tonumber(data.primary) >= 0 and tonumber(data.primary) <= 2 then
        TriggerEvent("voip:client:radio:set-balance", "radio-sr", "primary", data.primary)
        SoundProvider.default(0.5)

        cb("ok")
        return
    end
    if data.secondary and tonumber(data.secondary) >= 0 and tonumber(data.secondary) <= 2 then
        TriggerEvent("voip:client:radio:set-balance", "radio-sr", "secondary", data.secondary)
        SoundProvider.default(0.5)

        cb("ok")
        return
    end
    cb("nok")
end)

RegisterNUICallback("radio/change_volume", function(data, cb)
    if not radioEnabled then
        cb("nok")
        return
    end
    if data.primary then
        exports["soz-voip"]:SetRadioShortRangePrimaryVolume(data.primary)
        SoundProvider.default(data.primary)

        cb("ok")
        return
    end
    if data.secondary then
        exports["soz-voip"]:SetRadioShortRangeSecondaryVolume(data.secondary)
        SoundProvider.default(data.secondary)

        cb("ok")
        return
    end
    cb("nok")
end)

--- Events
RegisterNetEvent("talk:radio:use", function()
    toggleRadio(not radioOpen)
end)

RegisterCommand("radio_toggle", function()
    local player = PlayerPedId()
    if haveItem and (not IsNuiFocused() or radioOpen) and DoesEntityExist(player) and not PlayerData.metadata["isdead"] and
        not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] and not IsPauseMenuActive() then
        toggleRadio(not radioOpen)
    end
end, false)
RegisterKeyMapping("radio_toggle", "Sortir la radio", "keyboard", "N")

exports("isRadioOpen", function()
    return radioOpen
end)

exports("setRadioOpen", function(status)
    toggleRadio(status)
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    powerOffRadio()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    haveItem = false

    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "radio" then
            haveItem = true
            break
        end
    end

    if not haveItem then
        powerOffRadio()
        SendNUIMessage({type = "radio", action = "reset"})
    end
end)


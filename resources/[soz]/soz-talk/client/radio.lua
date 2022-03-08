local radioOpen, radioEnabled, radioProp = false, false, nil

local primaryRadio = {frequency = 0.0, volume = 100}
local secondaryRadio = {frequency = 0.0, volume = 100}

--- Functions
local function toggleRadioAnimation(pState)
    QBCore.Functions.RequestAnimDict("cellphone@")
    if pState then
        TriggerEvent("attachItemRadio", "radio01")
        TaskPlayAnim(PlayerPedId(), "cellphone@", "cellphone_text_read_base", 2.0, 3.0, -1, 49, 0, 0, 0, 0)
        radioProp = CreateObject(GetHashKey("prop_cs_hand_radio"), 1.0, 1.0, 1.0, 1, 1, 0)
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

local function connectToRadio(channel, isPrimary)
    if tonumber(channel) ~= nil and tonumber(channel) >= 1000 and tonumber(channel) <= 9999 then
        exports["soz-voip"]:setRadioChannel(channel, isPrimary)
    end
end

local function leaveRadio()
    if primaryRadio.frequency ~= 0 or secondaryRadio.frequency ~= 0 then
        primaryRadio.frequency = 0
        secondaryRadio.frequency = 0
        exports["soz-voip"]:setRadioChannel(0, true)
        exports["soz-voip"]:setRadioChannel(0, false)

        clickSound()
    end
end

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
    if not radioEnabled then
        leaveRadio()
    end
    clickSound()
    cb("ok")
end)

RegisterNUICallback("radio/change_frequency", function(data, cb)
    if data.primary and tonumber(data.primary) >= 1000 and tonumber(data.primary) <= 9999 then
        primaryRadio.frequency = data.primary
        connectToRadio(primaryRadio.frequency, true)
    end
    if data.secondary and tonumber(data.secondary) >= 1000 and tonumber(data.secondary) <= 9999 then
        secondaryRadio.frequency = data.secondary
        connectToRadio(secondaryRadio.frequency, false)
    end
    clickSound()
    cb("ok")
end)

RegisterNUICallback("radio/change_ear", function(data, cb)
    if data.primary and tonumber(data.primary) >= 0 and tonumber(data.primary) <= 2 then
        exports["soz-voip"]:setVoiceEar("primaryRadio", tonumber(data.primary))
    end
    if data.secondary and tonumber(data.secondary) >= 0 and tonumber(data.secondary) <= 2 then
        exports["soz-voip"]:setVoiceEar("secondaryRadio", tonumber(data.primary))
    end
    clickSound()
    cb("ok")
end)

RegisterNUICallback("radio/change_volume", function(data, cb)
    if data.primary then
        primaryRadio.volume = data.primary
        exports["soz-voip"]:setVolume("primaryRadio", primaryRadio.volume)
    end
    if data.secondary then
        secondaryRadio.volume = data.secondary
        exports["soz-voip"]:setVolume("secondaryRadio", secondaryRadio.volume)
    end
    clickSound()
    cb("ok")
end)

--- Events
RegisterNetEvent("talk:radio:use", function()
    toggleRadio(not radioOpen)
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    leaveRadio()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    local haveItem = false

    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "radio" then
            haveItem = true
            break
        end
    end

    if not haveItem then
        leaveRadio()
    end
end)

--- Exports
exports("ReconnectToRadio", function()
    if primaryRadio.frequency ~= 0.0 then
        connectToRadio(primaryRadio.frequency, true)
    end
    if secondaryRadio.frequency ~= 0.0 then
        connectToRadio(secondaryRadio.frequency, false)
    end
end)

exports("IsRadioOn", function()
    return primaryRadio.frequency ~= 0.0 and secondaryRadio.frequency ~= 0.0
end)

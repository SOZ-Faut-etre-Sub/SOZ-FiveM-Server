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

local function closeEvent()
    TriggerEvent("InteractSound_CL:PlayOnOne", "click", 0.6)
end

local function connecttoradio(channel)
    if tostring(channel) ~= nil then
        exports["soz-voip"]:setRadioChannel(channel)
        QBCore.Functions.Notify(Config.messages["joined_to_radio"] .. channel .. " MHz", "success")
    end
end

local function leaveradio()
    closeEvent()
    primaryRadio.frequency = 0
    exports["soz-voip"]:setRadioChannel(0)
    exports["soz-voip"]:setVoiceProperty("radioEnabled", false)
    QBCore.Functions.Notify(Config.messages["you_leave"], "error")
end

local function toggleRadio(toggle)
    radioOpen = toggle
    SetNuiFocus(radioOpen, radioOpen)
    SetNuiFocusKeepInput(radioOpen)
    if radioOpen then
        toggleRadioAnimation(true)
        SendNUIMessage({type = "radio", action = "open"})
    else
        toggleRadioAnimation(false)
        SendNUIMessage({type = "radio", action = "close"})
    end
end

--- NUI
RegisterNUICallback("radio/toggle", function(data, cb)
    toggleRadio(data.state)
end)

RegisterNUICallback("radio/enable", function(data, cb)
    radioEnabled = data.state
    if radioEnabled then
        exports["soz-voip"]:setVoiceProperty("radioEnabled", true)
    else
        leaveradio()
    end
    cb("ok")
end)

RegisterNUICallback("radio/change_frequency", function(data, cb)
    if data.primary then
        primaryRadio.frequency = data.primary
        connecttoradio(primaryRadio.frequency)
        cb("ok")
    end
    if data.secondary then
        secondaryRadio.frequency = data.secondary
        cb("ok")
    end
end)

RegisterNUICallback("radio/change_volume", function(data, cb)
    if data.primary then
        primaryRadio.volume = data.primary
        exports["soz-voip"]:setRadioVolume(primaryRadio.volume)
        QBCore.Functions.Notify(Config.messages["volume_radio"] .. primaryRadio.volume, "success")
        cb("ok")
    end
    if data.secondary then
        secondaryRadio.volume = data.secondary
        cb("ok")
    end
end)

--- Events
RegisterNetEvent("talk:radio:use", function()
    toggleRadio(not radioOpen)
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    leaveradio()
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
        leaveradio()
    end
end)

--- Exports
exports("IsRadioOn", function()
    return primaryRadio.frequency ~= 0.0 and secondaryRadio.frequency ~= 0.0
end)

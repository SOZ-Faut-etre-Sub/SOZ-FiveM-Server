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

local function clickSound()
    TriggerEvent("InteractSound_CL:PlayOnOne", "click", 0.3)
end

local function connectToRadio(channel, isPrimary)
    if tonumber(channel) ~= nil and tonumber(channel) >= 1000 and tonumber(channel) <= 9999 then
        exports["soz-voip"]:setRadioChannel(channel, isPrimary)
    end
end

local function leaveRadio()
    primaryRadio.frequency = 0
    secondaryRadio.frequency = 0
    exports["soz-voip"]:setRadioChannel(0, true)
    exports["soz-voip"]:setRadioChannel(0, false)
    clickSound()
end

local function toggleRadio(toggle)
    SetNuiFocus(toggle, toggle)
    SetNuiFocusKeepInput(toggle)
    radioOpen = toggle

    if radioOpen then
        toggleRadioAnimation(true)
        SendNUIMessage({type = "radio", action = "open"})

        CreateThread(function()
            while radioOpen do
                Wait(0)

                DisableControlAction(0, 1, true) -- Look Left/Right
                DisableControlAction(0, 2, true) -- Look up/Down
                DisableControlAction(0, 16, true) -- Next Weapon
                DisableControlAction(0, 17, true) -- Select Previous Weapon
                DisableControlAction(0, 22, true) -- Jump
                DisableControlAction(0, 24, true) -- Attack
                DisableControlAction(0, 25, true) -- Aim
                DisableControlAction(0, 26, true) -- Look Behind
                DisableControlAction(0, 36, true) -- Input Duck/Sneak
                DisableControlAction(0, 37, true) -- Weapon Wheel
                DisableControlAction(0, 44, true) -- Cover
                DisableControlAction(0, 47, true) -- Detonate
                DisableControlAction(0, 55, true) -- Dive
                DisableControlAction(0, 75, true) -- Exit Vehicle
                DisableControlAction(0, 76, true) -- Vehicle Handbrake
                DisableControlAction(0, 81, true) -- Next Radio (Vehicle)
                DisableControlAction(0, 82, true) -- Previous Radio (Vehicle)
                DisableControlAction(0, 91, true) -- Passenger Aim (Vehicle)
                DisableControlAction(0, 92, true) -- Passenger Attack (Vehicle)
                DisableControlAction(0, 99, true) -- Select Next Weapon (Vehicle)
                DisableControlAction(0, 106, true) -- Control Override (Vehicle)
                DisableControlAction(0, 114, true) -- Fly Attack (Flying)
                DisableControlAction(0, 115, true) -- Next Weapon (Flying)
                DisableControlAction(0, 121, true) -- Fly Camera (Flying)
                DisableControlAction(0, 122, true) -- Control OVerride (Flying)
                DisableControlAction(0, 135, true) -- Control OVerride (Sub)
                DisableControlAction(0, 200, true) -- Pause Menu
                DisableControlAction(0, 245, true) -- Chat
            end
        end)
    else
        toggleRadioAnimation(false)
        SendNUIMessage({type = "radio", action = "close"})
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
exports("IsRadioOn", function()
    return primaryRadio.frequency ~= 0.0 and secondaryRadio.frequency ~= 0.0
end)

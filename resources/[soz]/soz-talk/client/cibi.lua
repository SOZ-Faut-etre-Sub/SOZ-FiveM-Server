local currentVehicle, radioOpen = 0, false
local stateBagHandlers = {}

--- Functions
local function handleUpdateRadio(data, isPrimary)
    exports["soz-voip"]:setRadioChannel("radio-lr", data.frequency, isPrimary)
    exports["soz-voip"]:setVolume("radio-lr", data.volume, isPrimary)
    exports["soz-voip"]:setVoiceEar("radio-lr", data.ear, isPrimary)
    SendNUIMessage({type = "cibi", action = "frequency_change", frequency = data.frequency, isPrimary = isPrimary})
    SendNUIMessage({type = "cibi", action = "volume_change", volume = data.volume, isPrimary = isPrimary})
    SendNUIMessage({type = "cibi", action = "ear_change", ear = data.ear, isPrimary = isPrimary})
end

local function vehicleUnregisterHandlers()
    for _, handler in ipairs(stateBagHandlers) do
        RemoveStateBagChangeHandler(handler)
    end
    exports["soz-voip"]:setRadioChannel("radio-lr", 0, true)
    exports["soz-voip"]:setRadioChannel("radio-lr", 0, false)
end

local function vehicleRegisterHandlers()
    local state = Entity(currentVehicle).state

    handleUpdateRadio(state.primaryRadio, true)
    handleUpdateRadio(state.secondaryRadio, false)
    SendNUIMessage({type = "cibi", action = "enabled", isEnabled = state.radioEnabled})

    stateBagHandlers[#stateBagHandlers + 1] = AddStateBagChangeHandler("radioEnabled", "entity:" .. VehToNet(currentVehicle), function(_, _, value, _, _)
        if value ~= nil then
            SendNUIMessage({type = "cibi", action = "enabled", isEnabled = value})

            if not value then
                exports["soz-voip"]:setRadioChannel("radio-lr", 0, true)
                exports["soz-voip"]:setRadioChannel("radio-lr", 0, false)
            end
        end
    end)

    stateBagHandlers[#stateBagHandlers + 1] = AddStateBagChangeHandler("primaryRadio", "entity:" .. VehToNet(currentVehicle), function(_, _, value, _, _)
        if value ~= nil and value.frequency > 0.0 then
            handleUpdateRadio(value, true)
        end
    end)

    stateBagHandlers[#stateBagHandlers + 1] = AddStateBagChangeHandler("secondaryRadio", "entity:" .. VehToNet(currentVehicle), function(_, _, value, _, _)
        if value ~= nil and value.frequency > 0.0 then
            handleUpdateRadio(value, false)
        end
    end)
end

local function toggleRadio(toggle)
    if toggle and Entity(currentVehicle).state.radioInUse then
        exports["soz-hud"]:DrawNotification("La radio est déjà utilisée", "error")

        return
    end
    radioOpen = toggle
    SetNuiFocus(radioOpen, radioOpen)
    SetNuiFocusKeepInput(radioOpen)

    TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "radioInUse", radioOpen)

    if radioOpen then
        SendNUIMessage({type = "cibi", action = "open"})
        TriggerEvent("talk:action:disable")
    else
        SendNUIMessage({type = "cibi", action = "close"})
        TriggerEvent("talk:action:enable")
    end
end

--- NUI
RegisterNUICallback("cibi/toggle", function(data, cb)
    toggleRadio(data.state)
    cb("ok")
end)

RegisterNUICallback("cibi/enable", function(data, cb)
    TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "radioEnabled", data.state)
    SoundProvider.toggle()
    cb("ok")
end)

RegisterNUICallback("cibi/change_frequency", function(data, cb)
    local state = LocalPlayer.state["radio-lr"]
    if data.primary and tonumber(data.primary) >= Config.Radio.min and tonumber(data.primary) <= Config.Radio.max then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio",
                           {
            frequency = tonumber(data.primary),
            volume = state.primaryChannelVolume,
            ear = state.primaryChannelEar,
        })
        SoundProvider.default(state.primaryChannelVolume)
        cb("ok")
        return
    end
    if data.secondary and tonumber(data.secondary) >= Config.Radio.min and tonumber(data.secondary) <= Config.Radio.max then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio",
                           {
            frequency = tonumber(data.secondary),
            volume = state.secondaryChannelVolume,
            ear = state.secondaryChannelEar,
        })
        SoundProvider.default(state.secondaryChannelVolume)
        cb("ok")
        return
    end
    cb("nok")
end)

RegisterNUICallback("cibi/change_volume", function(data, cb)
    local state = LocalPlayer.state["radio-lr"]
    if data.primary then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio",
                           {frequency = state.primaryChannel, volume = data.primary, ear = state.primaryChannelEar})
        SoundProvider.default(data.primary)
        cb("ok")
        return
    end
    if data.secondary then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio",
                           {
            frequency = state.secondaryChannel,
            volume = data.secondary,
            ear = state.secondaryChannelEar,
        })
        SoundProvider.default(data.secondary)
        cb("ok")
        return
    end
    cb("nok")
end)

RegisterNUICallback("cibi/change_ear", function(data, cb)
    local state = LocalPlayer.state["radio-lr"]
    if data.primary and tonumber(data.primary) >= 0 and tonumber(data.primary) <= 2 then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio",
                           {frequency = state.primaryChannel, volume = state.primaryChannelVolume, ear = data.primary})
        SoundProvider.default(state.primaryChannelVolume)
        cb("ok")
        return
    end
    if data.secondary and tonumber(data.secondary) >= 0 and tonumber(data.secondary) <= 2 then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio",
                           {
            frequency = state.secondaryChannel,
            volume = state.secondaryChannelVolume,
            ear = data.secondary,
        })
        SoundProvider.default(state.secondaryChannelVolume)
        cb("ok")
        return
    end
    cb("nok")
end)

--- Events
RegisterNetEvent("talk:cibi:use", function()
    if Entity(currentVehicle).state.hasRadio then
        toggleRadio(not radioOpen)
    end
end)

--- Loops
CreateThread(function()
    while true do
        local ped = PlayerPedId()

        if LocalPlayer.state.isLoggedIn then
            if currentVehicle == 0 and not PlayerData.metadata["isdead"] and not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] then
                if IsPedInAnyVehicle(ped, false) then
                    currentVehicle = GetVehiclePedIsUsing(ped)

                    if Entity(currentVehicle).state.hasRadio then
                        vehicleRegisterHandlers()
                    end
                end
            else
                if currentVehicle ~= 0 and not IsPedInAnyVehicle(ped, false) or PlayerData.metadata["isdead"] or PlayerData.metadata["ishandcuffed"] or
                    PlayerData.metadata["inlaststand"] then
                    if Entity(currentVehicle).state.hasRadio then
                        vehicleUnregisterHandlers()
                    end

                    currentVehicle = 0
                end
            end
        end

        Wait(1000)
    end
end)

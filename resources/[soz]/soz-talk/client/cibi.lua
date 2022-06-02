local currentVehicle, radioOpen = 0, false
local primaryRadio, secondaryRadio = nil, nil
local primaryRadioVolume, secondaryRadioVolume = 100, 100
local stateBagHandlers = {}

--- Functions
local function handleUpdateRadio(data, isPrimary)
    if isPrimary and data.frequency ~= primaryRadio then
        TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", primaryRadio, "primary")
    elseif not isPrimary and data.frequency ~= secondaryRadio then
        TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", secondaryRadio, "secondary")
    end
    TriggerServerEvent("voip:server:radio:connect", "radio-lr", isPrimary and "primary" or "secondary", data.frequency)
    if isPrimary then
        exports["soz-voip"]:SetRadioLongRangePrimaryVolume(data.volume or 100)
    else
        exports["soz-voip"]:SetRadioLongRangeSecondaryVolume(data.volume or 100)
    end
    -- exports["soz-voip"]:setVoiceEar("radio-lr", data.ear, isPrimary)

    SendNUIMessage({type = "cibi", action = "frequency_change", frequency = data.frequency, isPrimary = isPrimary})
    SendNUIMessage({type = "cibi", action = "volume_change", volume = data.volume, isPrimary = isPrimary})
    -- SendNUIMessage({type = "cibi", action = "ear_change", ear = data.ear, isPrimary = isPrimary})

    if isPrimary then
        primaryRadio = data.frequency
        primaryRadioVolume = data.volume
    else
        secondaryRadio = data.frequency
        secondaryRadioVolume = data.volume
    end
end

local function vehicleRegisterHandlers()
    local playerPed = PlayerPedId()
    local state = Entity(currentVehicle).state

    if GetPedInVehicleSeat(currentVehicle, -1) ~= playerPed and GetPedInVehicleSeat(currentVehicle, 0) ~= playerPed then
        return
    end

    exports["soz-voip"]:SetRadioLongRangePowerState(true)

    handleUpdateRadio(state.primaryRadio, true)
    handleUpdateRadio(state.secondaryRadio, false)
    SendNUIMessage({type = "cibi", action = "enabled", isEnabled = state.radioEnabled})

    stateBagHandlers[#stateBagHandlers + 1] = AddStateBagChangeHandler("radioEnabled", "entity:" .. VehToNet(currentVehicle), function(_, _, value, _, _)
        if value ~= nil then
            SendNUIMessage({type = "cibi", action = "enabled", isEnabled = value})
        end

        if value then
            if Entity(currentVehicle).state.primaryRadio then
                TriggerServerEvent("voip:server:radio:connect", "radio-lr", "primary", Entity(currentVehicle).state.primaryRadio.frequency)
            end

            if Entity(currentVehicle).state.secondaryRadio then
                TriggerServerEvent("voip:server:radio:connect", "radio-lr", "secondary", Entity(currentVehicle).state.secondaryRadio.frequency)
            end
        else
            exports["soz-voip"]:SetRadioLongRangePowerState(false)
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

local function vehicleUnregisterHandlers()
    for _, handler in ipairs(stateBagHandlers) do
        RemoveStateBagChangeHandler(handler)
    end
    exports["soz-voip"]:SetRadioLongRangePowerState(false)
    SendNUIMessage({type = "cibi", action = "reset"})
    toggleRadio(false)
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
    if not Entity(currentVehicle).state.radioEnabled then
        cb("nok")
        return
    end
    if data.primary and tonumber(data.primary) >= Config.Radio.min and tonumber(data.primary) <= Config.Radio.max then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", {
            frequency = tonumber(data.primary),
            volume = primaryRadioVolume,
            -- ear = state.primaryChannelEar,
        })
        SoundProvider.default(0.5)
        cb("ok")
        return
    end
    if data.secondary and tonumber(data.secondary) >= Config.Radio.min and tonumber(data.secondary) <= Config.Radio.max then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", {
            frequency = tonumber(data.secondary),
            volume = secondaryRadioVolume,
            -- ear = state.secondaryChannelEar,
        })
        SoundProvider.default(0.5)
        cb("ok")
        return
    end
    cb("nok")
end)

RegisterNUICallback("cibi/change_volume", function(data, cb)
    if not Entity(currentVehicle).state.radioEnabled then
        cb("nok")
        return
    end
    if data.primary then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", {
            frequency = primaryRadio,
            volume = data.primary,
            -- ear = state.primaryChannelEar
        })
        SoundProvider.default(data.primary)
        cb("ok")
        return
    end
    if data.secondary then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", {
            frequency = secondaryRadio,
            volume = data.secondary,
            -- ear = state.secondaryChannelEar,
        })
        SoundProvider.default(data.secondary)
        cb("ok")
        return
    end
    cb("nok")
end)

RegisterNUICallback("cibi/change_ear", function(data, cb)
    if not Entity(currentVehicle).state.radioEnabled then
        cb("nok")
        return
    end
    --[[local state = LocalPlayer.state["radio-lr"]
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
    end]]
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
            if currentVehicle == 0 and not PlayerData.metadata["isdead"] and not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] and
                IsPedInAnyVehicle(ped, false) then
                currentVehicle = GetVehiclePedIsUsing(ped)

                if Entity(currentVehicle).state.hasRadio then
                    vehicleRegisterHandlers()
                end
            elseif currentVehicle ~= 0 and (not IsPedInAnyVehicle(ped, false) or PlayerData.metadata["isdead"] or PlayerData.metadata["ishandcuffed"]) or
                PlayerData.metadata["inlaststand"] then

                if Entity(currentVehicle).state.hasRadio or not DoesEntityExist(currentVehicle) then
                    vehicleUnregisterHandlers()
                end

                currentVehicle = 0
            end
        end

        Wait(1000)
    end
end)

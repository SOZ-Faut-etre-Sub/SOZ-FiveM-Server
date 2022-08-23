local currentVehicle, radioOpen = 0, false
local primaryRadio, secondaryRadio = nil, nil
local isRegistered = false
local stateBagHandlers = {}

--- Functions
local function handleUpdateRadio(data, isPrimary)
    if isPrimary and data.frequency ~= primaryRadio then
        if primaryRadio ~= nil and primaryRadio ~= secondaryRadio then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", primaryRadio, "primary")
        end

        if data.frequency ~= nil then
            TriggerServerEvent("voip:server:radio:connect", "radio-lr", "primary", data.frequency)
        end

        primaryRadio = data.frequency
    end

    if not isPrimary and data.frequency ~= secondaryRadio then
        if secondaryRadio ~= nil and secondaryRadio ~= primaryRadio then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", secondaryRadio, "secondary")
        end

        if data.frequency ~= nil then
            TriggerServerEvent("voip:server:radio:connect", "radio-lr", "secondary", data.frequency)
        end

        secondaryRadio = data.frequency
    end

    if isPrimary then
        exports["soz-voip"]:SetRadioLongRangePrimaryVolume(data.volume or 100)
        TriggerEvent("voip:client:radio:set-balance", "radio-lr", "primary", data.ear)
    else
        exports["soz-voip"]:SetRadioLongRangeSecondaryVolume(data.volume or 100)
        TriggerEvent("voip:client:radio:set-balance", "radio-lr", "secondary", data.ear)
    end

    SendNUIMessage({type = "cibi", action = "frequency_change", frequency = data.frequency, isPrimary = isPrimary})
    SendNUIMessage({type = "cibi", action = "volume_change", volume = data.volume, isPrimary = isPrimary})
    SendNUIMessage({type = "cibi", action = "ear_change", ear = data.ear, isPrimary = isPrimary})
end

local function vehicleRegisterHandlers()
    local playerPed = PlayerPedId()
    local state = Entity(currentVehicle).state

    if GetPedInVehicleSeat(currentVehicle, -1) ~= playerPed and GetPedInVehicleSeat(currentVehicle, 0) ~= playerPed then
        return false
    end

    if state.radioEnabled then
        handleUpdateRadio(state.primaryRadio, true)
        handleUpdateRadio(state.secondaryRadio, false)
    end

    SendNUIMessage({type = "cibi", action = "enabled", isEnabled = state.radioEnabled})

    stateBagHandlers[#stateBagHandlers + 1] = AddStateBagChangeHandler("radioEnabled", "entity:" .. VehToNet(currentVehicle), function(_, _, value, _, _)
        if value ~= nil then
            SendNUIMessage({type = "cibi", action = "enabled", isEnabled = value})
        end

        if value then
            local statePrimary = Entity(currentVehicle).state.primaryRadio
            local stateSecondary = Entity(currentVehicle).state.secondaryRadio

            if statePrimary then
                handleUpdateRadio(statePrimary, true)
            end

            if stateSecondary then
                handleUpdateRadio(stateSecondary, false)
            end
        else
            TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", primaryRadio, "primary")
            TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", secondaryRadio, "secondary")

            primaryRadio = nil
            secondaryRadio = nil
        end
    end)

    stateBagHandlers[#stateBagHandlers + 1] = AddStateBagChangeHandler("primaryRadio", "entity:" .. VehToNet(currentVehicle), function(_, _, value, _, _)
        if value ~= nil then
            handleUpdateRadio(value, true)
        end
    end)

    stateBagHandlers[#stateBagHandlers + 1] = AddStateBagChangeHandler("secondaryRadio", "entity:" .. VehToNet(currentVehicle), function(_, _, value, _, _)
        if value ~= nil then
            handleUpdateRadio(value, false)
        end
    end)

    return true
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

    TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", primaryRadio, "primary")
    TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", secondaryRadio, "secondary")
    primaryRadio = nil
    secondaryRadio = nil

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

    if data.primary then
        local state = Entity(currentVehicle).state.primaryRadio
        state.frequency = tonumber(data.primary)

        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", state)
        SoundProvider.default(state.volume)

        cb("ok")

        return
    end
    if data.secondary then
        local state = Entity(currentVehicle).state.secondaryRadio
        state.frequency = tonumber(data.secondary)

        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", state)
        SoundProvider.default(state.volume)

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
        local state = Entity(currentVehicle).state.primaryRadio
        state.volume = data.primary

        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", state)
        SoundProvider.default(data.primary)
        cb("ok")
        return
    end
    if data.secondary then
        local state = Entity(currentVehicle).state.secondaryRadio
        state.volume = data.secondary

        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", state)
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
    if data.primary and tonumber(data.primary) >= 0 and tonumber(data.primary) <= 2 then
        local state = Entity(currentVehicle).state.primaryRadio
        state.ear = data.primary

        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", state)
        SoundProvider.default(state.volume)

        cb("ok")

        return
    end
    if data.secondary and tonumber(data.secondary) >= 0 and tonumber(data.secondary) <= 2 then
        local state = Entity(currentVehicle).state.secondaryRadio
        state.ear = data.secondary

        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", state)
        SoundProvider.default(state.volume)

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
            if currentVehicle == 0 and not PlayerData.metadata["isdead"] and not PlayerData.metadata["ishandcuffed"] and not PlayerData.metadata["inlaststand"] and
                IsPedInAnyVehicle(ped, false) then
                currentVehicle = GetVehiclePedIsUsing(ped)

                if Entity(currentVehicle).state.hasRadio then
                    isRegistered = vehicleRegisterHandlers()
                end
            end

            if currentVehicle ~= 0 and
                (not IsPedInAnyVehicle(ped, false) or PlayerData.metadata["isdead"] or PlayerData.metadata["ishandcuffed"] or PlayerData.metadata["inlaststand"]) then

                if isRegistered then
                    vehicleUnregisterHandlers()
                    isRegistered = false
                end

                currentVehicle = 0
            end
        end

        Wait(1000)
    end
end)

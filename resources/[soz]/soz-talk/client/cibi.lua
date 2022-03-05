local isInVehicle, currentVehicle = false, 0
local radioOpen, radioEnabled = false, false

local primaryRadio = {frequency = 0.0, volume = 100}
local secondaryRadio = {frequency = 0.0, volume = 100}

--- Functions
local function handleUpdatePrimaryRadio()
    exports["soz-voip"]:setRadioChannel(primaryRadio.frequency, true)
    exports["soz-voip"]:setVolume("primaryRadio", primaryRadio.volume)
    SendNUIMessage({type = "cibi", action = "frequency_change", frequency = primaryRadio.frequency, isPrimary = true})
    SendNUIMessage({type = "cibi", action = "volume_change", volume = primaryRadio.volume, isPrimary = true})
end

local function handleUpdateSecondaryRadio()
    exports["soz-voip"]:setRadioChannel(secondaryRadio.frequency, false)
    exports["soz-voip"]:setVolume("secondaryRadio", secondaryRadio.volume)
    SendNUIMessage({type = "cibi", action = "frequency_change", frequency = secondaryRadio.frequency, isPrimary = false})
    SendNUIMessage({type = "cibi", action = "volume_change", volume = secondaryRadio.volume, isPrimary = false})
end

local function setupStateBagForVehicle()
    if currentVehicle ~= 0 then
        if Entity(currentVehicle).state.radioEnabled == nil then
            TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "radioEnabled", false)
        else
            radioEnabled = Entity(currentVehicle).state.radioEnabled
            SendNUIMessage({type = "cibi", action = "enabled", isEnabled = radioEnabled})
        end
        if Entity(currentVehicle).state.radioInUse == nil then
            TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "radioInUse", false)
        end
        if Entity(currentVehicle).state.primaryRadio == nil then
            TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", {
                frequency = 0.0,
                volume = 100,
            })
        else
            primaryRadio = Entity(currentVehicle).state.primaryRadio
            handleUpdatePrimaryRadio()
        end
        if Entity(currentVehicle).state.secondaryRadio == nil then
            TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", {
                frequency = 0.0,
                volume = 100,
            })
        else
            secondaryRadio = Entity(currentVehicle).state.secondaryRadio
            handleUpdateSecondaryRadio()
        end

        AddStateBagChangeHandler("radioEnabled", "entity:" .. VehToNet(currentVehicle), function(bagName, key, value, _, _)
            if key == "radioEnabled" and value ~= nil then
                radioEnabled = value
                SendNUIMessage({type = "cibi", action = "enabled", isEnabled = value})

                if not value then
                    exports["soz-talk"]:ReconnectToRadio()
                end
            end
        end)

        AddStateBagChangeHandler("primaryRadio", "entity:" .. VehToNet(currentVehicle), function(bagName, key, value, _, _)
            if key == "primaryRadio" and value ~= nil and value.frequency > 0.0 then
                primaryRadio = value

                handleUpdatePrimaryRadio()
            end
        end)

        AddStateBagChangeHandler("secondaryRadio", "entity:" .. VehToNet(currentVehicle), function(bagName, key, value, _, _)
            if key == "secondaryRadio" and value ~= nil and value.frequency > 0.0 then
                secondaryRadio = value

                handleUpdateSecondaryRadio()
            end
        end)
    end
end

local function toggleRadio(toggle)
    if toggle and Entity(currentVehicle).state.radioInUse then
        exports["soz-hud"]:DrawNotification("~r~La radio est déjà utilisée")

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
    clickSound()
    cb("ok")
end)

RegisterNUICallback("cibi/change_frequency", function(data, cb)
    if data.primary and tonumber(data.primary) >= 1000 and tonumber(data.primary) <= 9999 then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", {
            frequency = data.primary,
            volume = primaryRadio.volume,
        })
    end
    if data.secondary and tonumber(data.secondary) >= 1000 and tonumber(data.secondary) <= 9999 then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", {
            frequency = data.secondary,
            volume = secondaryRadio.volume,
        })
    end
    clickSound()
    cb("ok")
end)

RegisterNUICallback("cibi/change_ear", function(data, cb)
    if data.primary and tonumber(data.primary) >= 0 and tonumber(data.primary) <= 2 then
        exports["soz-voip"]:setVoiceEar("primaryRadio", tonumber(data.primary))
    end
    if data.secondary and tonumber(data.secondary) >= 0 and tonumber(data.secondary) <= 2 then
        exports["soz-voip"]:setVoiceEar("secondaryRadio", tonumber(data.primary))
    end
    clickSound()
    cb("ok")
end)

RegisterNUICallback("cibi/change_volume", function(data, cb)
    if data.primary then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "primaryRadio", {
            frequency = primaryRadio.frequency,
            volume = data.primary,
        })
    end
    if data.secondary then
        TriggerServerEvent("talk:cibi:sync", VehToNet(currentVehicle), "secondaryRadio", {
            frequency = secondaryRadio.frequency,
            volume = data.secondary,
        })
    end
    clickSound()
    cb("ok")
end)

--- Events
RegisterNetEvent("talk:cibi:use", function()
    toggleRadio(not radioOpen)
end)

--- Exports
exports("IsCibiOn", function()
    return primaryRadio.frequency ~= 0.0 and secondaryRadio.frequency ~= 0.0
end)

--- Loops
CreateThread(function()
    while true do
        local ped = PlayerPedId()

        if not isInVehicle and not IsPlayerDead(PlayerId()) then
            if IsPedInAnyVehicle(ped, false) then
                isInVehicle = true
                currentVehicle = GetVehiclePedIsUsing(ped)

                setupStateBagForVehicle()
            end
        else
            if isInVehicle and not IsPedInAnyVehicle(ped, false) or IsPlayerDead(PlayerId()) then
                isInVehicle = false
                currentVehicle = 0

                exports["soz-talk"]:ReconnectToRadio()
            end
        end

        Wait(1000)
    end
end)

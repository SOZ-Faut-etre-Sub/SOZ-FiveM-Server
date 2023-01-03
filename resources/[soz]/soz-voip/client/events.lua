local function PlayLocalRadioClick(kind, transmit, volume)
    TriggerEvent("InteractSound_CL:PlayOnOne", transmit and kind .. "/mic_click_on" or kind .. "/mic_click_off", volume / 2)
end

local function PlayRemoteRadioClick(kind, transmit, volume)
    TriggerEvent("InteractSound_CL:PlayOnOne", transmit and kind .. "/mic_click_on" or kind .. "/mic_click_off", volume / 2)
end

local IsTalkingOnRadio = false

local function StartRadioAnimationTask()
    local pedId = PlayerPedId()
    IsTalkingOnRadio = true

    Citizen.CreateThread(function()
        local lib, anim = "random@arrests", "generic_radio_chatter"

        while not HasAnimDictLoaded(lib) do
            RequestAnimDict(lib)
            Citizen.Wait(0)
        end

        while IsTalkingOnRadio do
            if not IsEntityPlayingAnim(pedId, lib, anim, 3) then
                TaskPlayAnim(pedId, lib, anim, 8.0, -8.0, -1, 49, 0, false, false, false)
            end

            --- Enable Push To Talk input
            SetControlNormal(0, 249, 1.0)

            Citizen.Wait(0)
        end

        StopAnimTask(pedId, lib, anim, 3.0)
    end)
end

RegisterNetEvent("voip:client:call:start", function(callerId)
    CallModuleInstance:startCall(callerId)
end)

RegisterNetEvent("voip:client:call:end", function()
    CallModuleInstance:stopCall()
end)

RegisterNetEvent("voip:client:call:setMute", function(state)
    CallModuleInstance:setMutePlayer(source, state)
end)

RegisterNetEvent("voip:client:radio:transmission:start", function(frequency, serverId, coords, kind)
    if PrimaryLongRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick(kind, true, Config.volumeRadioSoundClick)
    end

    if SecondaryLongRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick(kind, true, Config.volumeRadioSoundClick)
    end

    if PrimaryShortRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick(kind, true, Config.volumeRadioSoundClick)
    end

    if SecondaryShortRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick(kind, true, Config.volumeRadioSoundClick)
    end
end)

RegisterNetEvent("voip:client:radio:transmission:stop", function(frequency, serverId, kind)
    if PrimaryLongRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick(kind, false, Config.volumeRadioSoundClick)
    end

    if SecondaryLongRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick(kind, false, Config.volumeRadioSoundClick)
    end

    if PrimaryShortRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick(kind, false, Config.volumeRadioSoundClick)
    end

    if SecondaryShortRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick(kind, false, Config.volumeRadioSoundClick)
    end
end)

local function GetRadioForKindAndInstance(kind, instance)
    if kind == "radio-lr" and instance == "primary" then
        return PrimaryLongRadioModuleInstance
    end

    if kind == "radio-lr" and instance == "secondary" then
        return SecondaryLongRadioModuleInstance
    end

    if kind == "radio-sr" and instance == "primary" then
        return PrimaryShortRadioModuleInstance
    end

    if kind == "radio-sr" and instance == "secondary" then
        return SecondaryShortRadioModuleInstance
    end

    return nil
end

RegisterNetEvent("voip:client:radio:player:connect", function(kind, instance, frequency, serverId)
    local radio = GetRadioForKindAndInstance(kind, instance)

    if radio ~= nil then
        radio:onPlayerConnect(frequency, serverId)
    end
end)

RegisterNetEvent("voip:client:radio:player:disconnect", function(kind, instance, frequency, serverId)
    local radio = GetRadioForKindAndInstance(kind, instance)

    if radio ~= nil then
        radio:onPlayerDisconnect(frequency, serverId)
    end
end)

RegisterNetEvent("voip:client:radio:connect", function(kind, instance, frequency, consumers)
    local radio = GetRadioForKindAndInstance(kind, instance)

    if radio ~= nil then
        radio:connect(frequency, consumers)
    end
end)

RegisterNetEvent("voip:client:radio:disconnect", function(kind, frequency, instance)
    local radio = GetRadioForKindAndInstance(kind, instance)

    if radio ~= nil then
        radio:disconnect()
    end
end)

RegisterNetEvent("voip:client:radio:set-balance", function(kind, instance, ear)
    local radio = GetRadioForKindAndInstance(kind, instance)
    local balance = "center"

    if ear == 0 then
        balance = "left"
    end

    if ear == 2 then
        balance = "right"
    end

    if radio ~= nil then
        radio:setBalance(balance)
    end
end)

local function CreateTransmissionToggle(command, context, volumeKey, module)
    RegisterCommand("+" .. command, function()
        if module:startTransmission() then
            StartRadioAnimationTask()
            PlayLocalRadioClick(context, true, Config[volumeKey])
        end
    end, false)
    RegisterCommand("-" .. command, function()
        if module:stopTransmission() then
            PlayLocalRadioClick(context, false, Config[volumeKey])
            IsTalkingOnRadio = false
        end
    end, false)
end

CreateTransmissionToggle("radio_lr_primary", "radio-lr", "volumeRadioPrimaryLong", PrimaryLongRadioModuleInstance)
RegisterKeyMapping("+radio_lr_primary", "Parler en longue portée (primaire)", "keyboard", Config.radioLongRangePrimaryHotkey)

CreateTransmissionToggle("radio_lr_secondary", "radio-lr", "volumeRadioSecondaryLong", SecondaryLongRadioModuleInstance)
RegisterKeyMapping("+radio_lr_secondary", "Parler en longue portée (secondaire)", "keyboard", Config.radioLongRangeSecondaryHotkey)

CreateTransmissionToggle("radio_sr_primary", "radio-sr", "volumeRadioPrimaryShort", PrimaryShortRadioModuleInstance)
RegisterKeyMapping("+radio_sr_primary", "Parler en courte portée (primaire)", "keyboard", Config.radioShortRangePrimaryHotkey)

CreateTransmissionToggle("radio_sr_secondary", "radio-sr", "volumeRadioSecondaryShort", SecondaryShortRadioModuleInstance)
RegisterKeyMapping("+radio_sr_secondary", "Parler en courte portée (secondaire)", "keyboard", Config.radioShortRangeSecondaryHotkey)

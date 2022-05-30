local function PlayLocalRadioClick(context, transmit, volume)
    TriggerEvent("InteractSound_CL:PlayOnOne", transmit and context .. "/mic_click_on" or context .. "/mic_click_off", volume / 2)
end

local function PlayRemoteRadioClick(context, transmit, volume)
    TriggerEvent("InteractSound_CL:PlayOnOne", transmit and context .. "/mic_click_on" or context .. "/mic_click_off", volume / 2)
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

RegisterNetEvent("voip:client:radio:transmission:start", function(frequency, serverId, coords, kind)
    if PrimaryLongRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick("radio-lr", true, Config.volumeRadioPrimaryLong)
    end

    if SecondaryLongRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick("radio-lr", true, Config.volumeRadioSecondaryLong)
    end

    if PrimaryShortRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick("radio-sr", true, Config.volumeRadioPrimaryShort)
    end

    if SecondaryShortRadioModuleInstance:onTransmissionStarted(frequency, serverId, coords, kind) then
        PlayRemoteRadioClick("radio-sr", true, Config.volumeRadioSecondaryShort)
    end
end)

RegisterNetEvent("voip:client:radio:transmission:stop", function(frequency, serverId)
    if PrimaryLongRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick("radio-sr", false, Config.volumeRadioPrimaryLong)
    end

    if SecondaryLongRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick("radio-sr", false, Config.volumeRadioSecondaryLong)
    end

    if PrimaryShortRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick("radio-sr", false, Config.volumeRadioPrimaryShort)
    end

    if SecondaryShortRadioModuleInstance:onTransmissionStopped(frequency, serverId) then
        PlayRemoteRadioClick("radio-sr", false, Config.volumeRadioSecondaryShort)
    end
end)

RegisterNetEvent("voip:client:radio:connect", function(kind, instance, frequency)
    if kind == "radio-lr" and instance == "primary" then
        PrimaryLongRadioModuleInstance:connect(frequency)
    end

    if kind == "radio-lr" and instance == "secondary" then
        SecondaryLongRadioModuleInstance:connect(frequency)
    end

    if kind == "radio-sr" and instance == "primary" then
        PrimaryShortRadioModuleInstance:connect(frequency)
    end

    if kind == "radio-sr" and instance == "secondary" then
        SecondaryShortRadioModuleInstance:connect(frequency)
    end
end)

RegisterNetEvent("voip:client:radio:disconnect", function(kind, frequency, instance)
    if kind == "radio-lr" and instance == "primary" then
        PrimaryLongRadioModuleInstance:disconnect()
    end

    if kind == "radio-lr" and instance == "secondary" then
        SecondaryLongRadioModuleInstance:disconnect()
    end

    if kind == "radio-sr" and instance == "primary" then
        PrimaryShortRadioModuleInstance:disconnect()
    end

    if kind == "radio-sr" and instance == "secondary" then
        SecondaryShortRadioModuleInstance:disconnect()
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

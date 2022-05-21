IsTalkingOnRadio, RadioFrequencies = false, {}

function StartRadioAnimationTask()
    Citizen.CreateThread(function()
        local lib, anim = "random@arrests", "generic_radio_chatter"

        LoadAnimDict(lib)

        while IsTalkingOnRadio do
            if not IsEntityPlayingAnim(PlayerData.PlayerPedId, lib, anim, 3) then
                TaskPlayAnim(PlayerData.PlayerPedId, lib, anim, 8.0, -8.0, -1, 49, 0, false, false, false)
            end

            --- Enable Push To Talk input
            SetControlNormal(0, 249, 1.0)

            Citizen.Wait(0)
        end

        StopAnimTask(PlayerData.PlayerPedId, lib, anim, 3.0)
    end)
end

function StartTransmission(frequency, context)
    local channel = RadioFrequencies[frequency]
    if not channel then
        return
    end

    if not IsTalkingOnRadio then
        IsTalkingOnRadio = true

        AddGroupToTargetList(channel.consumers, context)

        StartRadioAnimationTask()
        PlayLocalRadioClick(context, true)

        console.debug("[Radio] Transmission started")
    end
end

function StopTransmission(frequency, context, forced)
    local channel = RadioFrequencies[frequency]
    if not IsTalkingOnRadio then
        return
    end

    promise:timeout(50):next(function(continue)
        if forced ~= true and not continue then
            return
        end

        IsTalkingOnRadio = false

        RemoveGroupToTargetList(channel.consumers, context)

        PlayLocalRadioClick(context, false)

        console.debug("[Radio] Transmission stopped")
    end)
end

--- Radio effect
function PlayLocalRadioClick(context, transmit)
    TriggerEvent("InteractSound_CL:PlayOnOne", transmit and context .. "/mic_click_on" or context .. "/mic_click_off", 0.5)
end

function PlayRemoteRadioClick(context, transmit)
    TriggerEvent("InteractSound_CL:PlayOnOne", transmit and context .. "/mic_click_on" or context .. "/mic_click_off", 0.5)
end

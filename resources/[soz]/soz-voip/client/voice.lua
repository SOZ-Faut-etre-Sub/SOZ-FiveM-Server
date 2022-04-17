local mutedPlayers = {}
local disableSubmixReset = {}

RegisterNetEvent("voip:client:mutePlayer", function(source, state)
    if state then
        mutedPlayers[source] = true
        MumbleSetVolumeOverrideByServerId(source, 0.0)
    else
        mutedPlayers[source] = nil
        MumbleSetVolumeOverrideByServerId(source, 1.0)
    end
end)

--- function playerTargets
--- Adds players voices to the local players listen channels allowing
--- Them to communicate at long range, ignoring proximity range.
--- @param targets table expects multiple tables to be sent over
function playerTargets(...)
    local targets = {...}
    local addedPlayers = {[CurrentPlayer.ServerId] = true}

    for i = 1, #targets do
        for id, _ in pairs(targets[i]) do
            -- we don't want to log ourself, or listen to ourself
            if addedPlayers[id] and id ~= CurrentPlayer.ServerId then
                goto skip_loop
            end
            if not addedPlayers[id] then
                addedPlayers[id] = true
                MumbleAddVoiceTargetPlayerByServerId(Config.VoiceTarget, id)
            end
            ::skip_loop::
        end
    end
end

--- function toggleVoice
--- Toggles the players voice
--- @param plySource number the players server id to override the volume for
--- @param enabled boolean if the players voice is getting activated or deactivated
--- @param moduleType string the volume & submix to use for the voice.
function toggleVoice(plySource, enabled, moduleType, extra)
    if mutedPlayers[plySource] then
        return
    end
    if enabled then
        MumbleSetVolumeOverrideByServerId(plySource, enabled and 1.0)
        if moduleType then
            disableSubmixReset[plySource] = true
            ApplySubmixEffect(moduleType, plySource, extra)
        else
            RemoveSubmixEffect(plySource)
        end
    else
        disableSubmixReset[plySource] = nil
        SetTimeout(250, function()
            if not disableSubmixReset[plySource] then
                RemoveSubmixEffect(plySource)
            end
        end)
        MumbleSetVolumeOverrideByServerId(plySource, -1.0)
    end
end

function playMicClicks(module, enabled, isPrimary)
    local volume = LocalPlayer.state[module][isPrimary and "primaryChannelVolume" or "secondaryChannelVolume"] / 100

    TriggerEvent("InteractSound_CL:PlayOnOne", enabled and module .. "/mic_click_on" or module .. "/mic_click_off", volume / 2)
end

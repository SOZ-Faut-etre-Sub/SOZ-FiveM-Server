local mutedPlayers = {}
local disableSubmixReset = {}

--- TODO REWORK THIS
radioData = {}
callData = {}
--- TODO REWORK THIS

--- toggles the targeted player muted
--- @param source number the player to mute
local function toggleMutePlayer(source)
    if mutedPlayers[source] then
        mutedPlayers[source] = nil
        MumbleSetVolumeOverrideByServerId(source, -1.0)
    else
        mutedPlayers[source] = true
        MumbleSetVolumeOverrideByServerId(source, 0.0)
    end
end
exports("toggleMutePlayer", toggleMutePlayer)

--- setVolume
--- @param volume number
--- @param volumeType string
function setVolume(volume, volumeType)
    volume = tonumber(volume / 100)

    if volumeType then
        if CurrentPlayer.Volume[volumeType] then
            LocalPlayer.state:set(volumeType, volume, true)
            CurrentPlayer.Volume[volumeType] = volume
        else
            error(("setVolume got a invalid volume type %s"):format(volumeType))
        end
    else
        error("setVolume got missing volume type")
    end
end

exports("getVolume", function(_type)
    return CurrentPlayer.Volume[_type]
end)
exports("setVolume", function(_type, vol)
    setVolume(vol, _type)
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
function toggleVoice(plySource, enabled, moduleType)
    if mutedPlayers[plySource] then
        return
    end
    if enabled then
        MumbleSetVolumeOverrideByServerId(plySource, enabled and CurrentPlayer.Volume[moduleType])
        if moduleType then
            disableSubmixReset[plySource] = true
            ApplySubmixEffect(moduleType, plySource)
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

--- function playMicClicks
--- plays the mic click if the player has them enabled.
--- @param clickType boolean whether to play the 'on' or 'off' click.
function playMicClicks(clickType, isPrimary)
    if CurrentPlayer.MicClicks ~= true then
        return
    end
    local volume = 0.5

    if isPrimary ~= nil then
        volume = isPrimary and CurrentPlayer.Volume["primaryRadio"] or CurrentPlayer.Volume["secondaryRadio"]
    end

    TriggerEvent("InteractSound_CL:PlayOnOne", clickType and "voip/mic_click_on" or "voip/mic_click_off", volume)
end

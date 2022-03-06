CurrentPlayer = {
    ServerId = GetPlayerServerId(PlayerId()),
    IsListenerEnabled = false,

    MicClicks = true,

    VoiceMode = 2,
    VoiceModeUpdateAllowed = true,
    VoiceModeProximityIsOverride = false,

    --- 0: left | 1: both | 2: right
    Ear = {["primaryRadio"] = 1, ["secondaryRadio"] = 1},
    Volume = table.deepclone(Config.DefaultVolume),

    RadioButtonPressed = false,
}

---Events
AddEventHandler("onClientResourceStart", function(resource)
    if resource ~= GetCurrentResourceName() then
        return
    end

    TriggerEvent("hud:client:UpdateVoiceMode", CurrentPlayer.VoiceMode - 1)

    if LocalPlayer.state.primaryRadioChannel ~= nil then
        setRadioChannel(LocalPlayer.state.primaryRadioChannel, true)
    end
    if LocalPlayer.state.secondaryRadioChannel ~= nil then
        setRadioChannel(LocalPlayer.state.secondaryRadioChannel, false)
    end

    if LocalPlayer.state.callChannel ~= nil then
        setCallChannel(LocalPlayer.state.callChannel)
    end
end)

RegisterNetEvent("onPlayerJoining", function(serverId)
    if CurrentPlayer.IsListenerEnabled then
        MumbleAddVoiceChannelListen(serverId)
    end
end)

AddEventHandler("mumbleConnected", function()
    local voiceModeData = Config.VoiceModes[CurrentPlayer.VoiceMode]
    LocalPlayer.state:set("proximity", {
        index = CurrentPlayer.VoiceMode,
        distance = voiceModeData[1],
        mode = voiceModeData[2],
    }, true)

    MumbleSetTalkerProximity(voiceModeData[1] + 0.0)
    MumbleClearVoiceTarget(Config.VoiceTarget)
    MumbleSetVoiceTarget(Config.VoiceTarget)
    MumbleSetVoiceChannel(CurrentPlayer.ServerId)

    while MumbleGetVoiceChannelFromServerId(CurrentPlayer.ServerId) ~= CurrentPlayer.ServerId do
        Wait(250)
    end

    MumbleAddVoiceTargetChannel(Config.VoiceTarget, CurrentPlayer.ServerId)

    addNearbyPlayers()
end)

RegisterNetEvent("onPlayerDropped", function(serverId)
    if CurrentPlayer.IsListenerEnabled then
        MumbleRemoveVoiceChannelListen(serverId)
    end
end)

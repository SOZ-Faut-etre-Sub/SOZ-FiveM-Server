--- Variables
voiceModule = {}

CurrentPlayer = {
    ServerId = GetPlayerServerId(PlayerId()),
    IsListenerEnabled = false,

    VoiceMode = 2,
    VoiceModeUpdateAllowed = true,
    VoiceModeProximityIsOverride = false,

    RadioButtonPressed = false,
    LastRadioButtonPressed = GetGameTimer(),
}

---Events
AddEventHandler("onClientResourceStart", function(resource)
    if resource ~= GetCurrentResourceName() then
        return
    end

    TriggerEvent("hud:client:UpdateVoiceMode", CurrentPlayer.VoiceMode - 1)

    local state = LocalPlayer.state
    if state["radio-sr"].primaryChannel ~= 0 then
        TriggerServerEvent("voip:server:setPlayerInChannel", "radio-sr", state["radio-sr"].primaryChannel, true)
    end
    if state["radio-sr"].secondaryChannel ~= 0 then
        TriggerServerEvent("voip:server:setPlayerInChannel", "radio-sr", state["radio-sr"].secondaryChannel, false)
    end
    if state.call.channel ~= nil then
        TriggerServerEvent("voip:server:setPlayerInChannel", "call", state.call.channel, false)
    end
end)

RegisterNetEvent("onPlayerJoining", function(serverId)
    if CurrentPlayer.IsListenerEnabled then
        MumbleAddVoiceChannelListen(serverId)
    end
end)

AddEventHandler("mumbleConnected", function()
    local voiceModeData = Config.VoiceModes[CurrentPlayer.VoiceMode]
    LocalPlayer.state:set("proximity", {index = CurrentPlayer.VoiceMode, distance = voiceModeData}, true)

    MumbleSetTalkerProximity(voiceModeData)
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

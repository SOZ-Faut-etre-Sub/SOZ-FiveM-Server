--- Proximity voice update
function setProximityState(proximityRange, isCustom)
    MumbleSetTalkerProximity(proximityRange + 0.0)
    LocalPlayer.state:set("proximity", {index = CurrentPlayer.VoiceMode, distance = proximityRange}, true)
    TriggerEvent("hud:client:UpdateVoiceMode", isCustom and #Config.VoiceModes or CurrentPlayer.VoiceMode - 1)
end

exports("overrideProximityRange", function(range, disableCycle)
    setProximityState(range, true)
    if disableCycle then
        CurrentPlayer.VoiceModeUpdateAllowed = false
        CurrentPlayer.VoiceModeProximityIsOverride = true
    end
end)

exports("clearProximityOverride", function()
    local voiceModeData = Config.VoiceModes[CurrentPlayer.VoiceMode]
    setProximityState(voiceModeData[1], false)
    if CurrentPlayer.VoiceModeProximityIsOverride then
        CurrentPlayer.VoiceModeUpdateAllowed = true
        CurrentPlayer.VoiceModeProximityIsOverride = false
    end
end)

--- Intent
exports("setVoiceIntent", function(intent)
    if intent == "speech" then
        MumbleSetAudioInputIntent(GetHashKey("speech"))
    elseif intent == "music" then
        MumbleSetAudioInputIntent(GetHashKey("music"))
    end
    LocalPlayer.state:set("voiceIntent", intent, true)
end)

--- Proximity voice update
function setProximityState(proximityRange)
    MumbleSetTalkerProximity(proximityRange + 0.0)
end

exports("overrideProximityRange", function(range, disableCycle)
    setProximityState(range)
    if disableCycle then
        CurrentPlayer.VoiceModeUpdateAllowed = false
        CurrentPlayer.VoiceModeProximityIsOverride = true
    end
end)

exports("clearProximityOverride", function()
    setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode])
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

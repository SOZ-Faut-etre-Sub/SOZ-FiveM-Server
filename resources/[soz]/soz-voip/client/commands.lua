--- Voice Mode
RegisterCommand("voip-voice_up", function()
    if not CurrentPlayer.VoiceModeUpdateAllowed then
        return
    end

    if CurrentPlayer.VoiceMode + 1 <= #Config.VoiceModes then
        CurrentPlayer.VoiceMode = CurrentPlayer.VoiceMode + 1

        setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode][1], false)
        TriggerEvent("pma-voice:setTalkingMode", CurrentPlayer.VoiceMode)
    end
end, false)
RegisterKeyMapping("voip-voice_up", "Parler plus fort", "keyboard", Config.Keys["voice_up"])

RegisterCommand("voip-voice_down", function()
    if not CurrentPlayer.VoiceModeUpdateAllowed then
        return
    end

    if CurrentPlayer.VoiceMode - 1 > 0 then
        CurrentPlayer.VoiceMode = CurrentPlayer.VoiceMode - 1

        setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode][1], false)
        TriggerEvent("pma-voice:setTalkingMode", CurrentPlayer.VoiceMode)
    end
end, false)
RegisterKeyMapping("voip-voice_down", "Parler moins fort", "keyboard", Config.Keys["voice_down"])

--- Proximity voice update
function setProximityState(proximityRange, isCustom)
    local voiceModeData = Config.VoiceModes[CurrentPlayer.VoiceMode]
    MumbleSetTalkerProximity(proximityRange + 0.0)
    LocalPlayer.state:set("proximity", {
        index = CurrentPlayer.VoiceMode,
        distance = proximityRange,
        mode = isCustom and "Custom" or voiceModeData[2],
    }, true)
    TriggerEvent("hud:client:UpdateVoiceMode", isCustom and #Config.VoiceModes or CurrentPlayer.VoiceMode - 1)
end

exports("overrideProximityRange", function(range, disableCycle)
    type_check({range, "number"})
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

--- Voice Mode
RegisterCommand("voip-voice_up", function()
    if not CurrentPlayer.VoiceModeUpdateAllowed then
        return
    end

    if CurrentPlayer.VoiceMode + 1 <= #Config.VoiceModes then
        CurrentPlayer.VoiceMode = CurrentPlayer.VoiceMode + 1
        setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode], false)
    end
end, false)
RegisterKeyMapping("voip-voice_up", "Parler plus fort", "keyboard", "F6")

RegisterCommand("voip-voice_down", function()
    if not CurrentPlayer.VoiceModeUpdateAllowed then
        return
    end

    if CurrentPlayer.VoiceMode - 1 > 0 then
        CurrentPlayer.VoiceMode = CurrentPlayer.VoiceMode - 1
        setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode], false)
    end
end, false)
RegisterKeyMapping("voip-voice_down", "Parler moins fort", "keyboard", "F5")

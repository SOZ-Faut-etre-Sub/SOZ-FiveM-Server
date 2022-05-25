--- Voice Mode
RegisterCommand("voip-voice_up", function()
    if not CurrentPlayer.VoiceModeUpdateAllowed then
        return
    end

    if CurrentPlayer.VoiceMode + 1 <= #Config.VoiceModes then
        CurrentPlayer.VoiceMode = CurrentPlayer.VoiceMode + 1
        setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode])
    end
end, false)
RegisterKeyMapping("voip-voice_up", "Parler plus fort", "keyboard", "F6")

RegisterCommand("voip-voice_down", function()
    if not CurrentPlayer.VoiceModeUpdateAllowed then
        return
    end

    if CurrentPlayer.VoiceMode - 1 > 0 then
        CurrentPlayer.VoiceMode = CurrentPlayer.VoiceMode - 1
        setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode])
    end
end, false)
RegisterKeyMapping("voip-voice_down", "Parler moins fort", "keyboard", "F5")

RegisterCommand("voip-voice_mute", function()
    if LocalPlayer.state.muted then
        LocalPlayer.state:set("muted", false, true)
        TriggerServerEvent("voip:server:muteMe", false)
        setProximityState(Config.VoiceModes[CurrentPlayer.VoiceMode])
    else
        LocalPlayer.state:set("muted", true, true)
        TriggerServerEvent("voip:server:muteMe", true)
        TriggerEvent("hud:client:UpdateVoiceMode", -1)
    end
end, false)
RegisterKeyMapping("voip-voice_mute", "Ne plus parler", "keyboard", "F7")

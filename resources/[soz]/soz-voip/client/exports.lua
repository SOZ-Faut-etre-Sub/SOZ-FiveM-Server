local voiceProximity = 2
local muted = false

local function SetVoiceProximity(proximity)
    local proximityConfig = Config.voiceRanges[proximity]

    ProximityModuleInstance:updateRange(proximityConfig.range)
    voiceProximity = proximity
    TriggerEvent("hud:client:UpdateVoiceMode", voiceProximity - 1)
end

local function MutePlayer(state)
    if state and type(state) == "boolean" then
        muted = state
    else
        muted = not muted
    end

    TriggerServerEvent("voip:server:player:mute", muted)

    if not muted then
        SetVoiceProximity(voiceProximity)
    else
        TriggerEvent("hud:client:UpdateVoiceMode", -1)
    end
end

local function ProximityVoiceIncrease()
    if voiceProximity >= #Config.voiceRanges then
        return
    end

    SetVoiceProximity(voiceProximity + 1)
end

local function ProximityVoiceDecrease()
    if voiceProximity <= 1 then
        return
    end

    SetVoiceProximity(voiceProximity - 1)
end

local function SetPlayerMegaphoneInUse(state)
    if state then
        ProximityModuleInstance:updateRange(Config.megaphoneRange)
    else
        SetVoiceProximity(voiceProximity)
    end
end

local function SetPlayerMicrophoneInUse(state)
    if state then
        ProximityModuleInstance:updateRange(Config.microphoneRange)
    else
        SetVoiceProximity(voiceProximity)
    end
end

RegisterCommand("voip-voice_up", ProximityVoiceIncrease, false)
RegisterKeyMapping("voip-voice_up", "Parler plus fort", "keyboard", Config.rangeIncreaseHotkey)

RegisterCommand("voip-voice_down", ProximityVoiceDecrease, false)
RegisterKeyMapping("voip-voice_down", "Parler moins fort", "keyboard", Config.rangeDecreaseHotkey)

RegisterCommand("voip-voice_mute", MutePlayer, false)
RegisterKeyMapping("voip-voice_mute", "Ne plus parler", "keyboard", Config.muteHotkey)

exports("MutePlayer", MutePlayer)
exports("SetPlayerMegaphoneInUse", SetPlayerMegaphoneInUse)
exports("SetPlayerMicrophoneInUse", SetPlayerMicrophoneInUse)

exports("SetRadioLongRangePowerState", function(state)
    if not state then
        local primaryFrequency = PrimaryLongRadioModuleInstance:disconnect()
        local secondaryFrequency = SecondaryLongRadioModuleInstance:disconnect()

        if primaryFrequency ~= nil then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", primaryFrequency, "primary")
        end

        if secondaryFrequency ~= nil then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-lr", secondaryFrequency, "secondary")
        end
    end
end)
exports("SetRadioShortRangePowerState", function(state)
    if not state then
        local primaryFrequency = PrimaryShortRadioModuleInstance:disconnect()
        local secondaryFrequency = SecondaryShortRadioModuleInstance:disconnect()

        if primaryFrequency ~= nil then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-sr", primaryFrequency, "primary")
        end

        if secondaryFrequency ~= nil then
            TriggerServerEvent("voip:server:radio:disconnect", "radio-sr", secondaryFrequency, "secondary")
        end
    end
end)

exports("ToggleRadioLongRangePrimaryMix", function()

end)

exports("SetRadioLongRangePrimaryVolume", function(volume)
    Config.volumeRadioPrimaryLong = volume / 100
end)

exports("SetRadioLongRangeSecondaryVolume", function(volume)
    Config.volumeRadioSecondaryLong = volume / 100
end)

exports("SetRadioShortRangePrimaryVolume", function(volume)
    Config.volumeRadioPrimaryShort = volume / 100
end)

exports("SetRadioShortRangeSecondaryVolume", function(volume)
    Config.volumeRadioSecondaryShort = volume / 100
end)

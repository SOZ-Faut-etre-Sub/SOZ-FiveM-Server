--- Private functions
local function MutePlayer()
    PlayerData.Muted = not PlayerData.Muted
    TriggerServerEvent("voip:server:player:mute", PlayerData.Muted)

    if not PlayerData.Muted then
        SetVoiceProximity(PlayerData.CurrentProximity)
    else
        TriggerEvent("hud:client:UpdateVoiceMode", -1)
    end
end

local function ProximityVoiceIncrease()
    local newProximity = PlayerData.CurrentProximity + 1
    local proximity = condition.ternary(Config.voiceRanges[newProximity] ~= nil, newProximity, PlayerData.CurrentProximity)

    SetVoiceProximity(proximity)
end

local function ProximityVoiceDecrease()
    local newProximity = PlayerData.CurrentProximity - 1
    local proximity = condition.ternary(Config.voiceRanges[newProximity] ~= nil, newProximity, PlayerData.CurrentProximity)

    SetVoiceProximity(proximity)
end

--- Public functions
function SetVoiceProximity(proximity)
    local voiceProximity = Config.voiceRanges[proximity]

    MumbleSetAudioInputDistance(voiceProximity.range)
    PlayerData.CurrentProximity = proximity
    TriggerEvent("hud:client:UpdateVoiceMode", PlayerData.CurrentProximity - 1)

    console.debug("Set voice proximity range to %s (%s)", voiceProximity.name, voiceProximity.range)
end

function RegisterProximityModule()
    console.debug("Proximity module registering...")

    --- Keybindings
    RegisterCommand("voip-voice_up", ProximityVoiceIncrease, false)
    RegisterKeyMapping("voip-voice_up", "Parler plus fort", "keyboard", Config.rangeIncreaseHotkey)

    RegisterCommand("voip-voice_down", ProximityVoiceDecrease, false)
    RegisterKeyMapping("voip-voice_down", "Parler moins fort", "keyboard", Config.rangeDecreaseHotkey)

    RegisterCommand("voip-voice_mute", MutePlayer, false)
    RegisterKeyMapping("voip-voice_mute", "Ne plus parler", "keyboard", Config.muteHotkey)

    console.debug("Proximity module registered !")
end

--- Variable registration
voiceStateBackend = {}
voiceModule = {}

--- Player management
AddEventHandler("playerJoining", function()
    local player = Player(source).state
    if not player.voipInit then
        player:set("proximity", {}, true)
        player:set("muted", false, true)
        player:set("voiceIntent", "speech", true)

        player:set("call", {channel = 0, volume = Config.DefaultVolume["call"]}, true)

        player:set("radio-sr", {
            primaryChannel = 0,
            primaryChannelVolume = Config.DefaultVolume["radio"],
            primaryChannelEar = Config.RadioEar.Both,
            secondaryChannel = 0,
            secondaryChannelVolume = Config.DefaultVolume["radio"],
            secondaryChannelEar = Config.RadioEar.Both,
        }, true)

        player:set("radio-lr", {
            primaryChannel = 0,
            primaryChannelVolume = Config.DefaultVolume["radio"],
            primaryChannelEar = Config.RadioEar.Both,
            secondaryChannel = 0,
            secondaryChannelVolume = Config.DefaultVolume["radio"],
            secondaryChannelEar = Config.RadioEar.Both,
        }, true)

        player:set("voipInit", true, false)
    end
end)

AddEventHandler("playerDropped", function()
    local playerState = Player(source).state

    if playerState.call.channel ~= 0 then
        voiceModule["call"]:removePlayer(source, playerState.call.channel, true)
    end

    for _, radio in ipairs({"radio-sr", "radio-lr"}) do
        if playerState[radio].primaryChannel ~= 0 or playerState[radio].secondaryChannel ~= 0 then
            voiceModule[radio]:removePlayer(source, playerState[radio].primaryChannel, true)
            voiceModule[radio]:removePlayer(source, playerState[radio].secondaryChannel, false)
        end
    end
end)

--- Exports
exports("addRadioChannelCheck", function(channel, cb)
    voiceStateBackend["radio"]:addChannelCheck(channel, cb)
end)

local voiceTarget = 1

CallModuleInstance = ModuleCall:new(Config.volumeCall)
PrimaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "short")
PrimaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "long")
SecondaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "short")
SecondaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "long")
CarModuleInstance = ModuleCar:new(Config.volumeVehicle)
ProximityModuleInstance = ModuleProximityCulling:new(Config.normalRange, Config.gridSize, Config.gridEdge)

local function updateSpeakers(speakers, newSpeakers, context, volume)
    for serverId, _ in pairs(newSpeakers) do
        if speakers[serverId] then
            speakers[serverId].volume = volume,
            table.insert(speakers[serverId].context, context)
        else
            speakers[serverId] = {
                volume = volume,
                context = { context },
            }
        end
    end

    return speakers
end

Citizen.CreateThread(function()
    CarModuleInstance:init()
    ProximityModuleInstance:init()

    MumbleSetVoiceTarget(voiceTarget)

    while true do
        -- first refresh state of proximity
        ProximityModuleInstance:refresh()

        -- get all speakers and channels
        local channels = ProximityModuleInstance:getChannels()
        local players = {}

        for serverId, _ in pairs(ProximityModuleInstance:getSpeakers()) do
            players[serverId] = {
                volume = -1.0,
                context = { "proximity" }
            }
        end

        players = updateSpeakers(players, CarModuleInstance:getSpeakers(), "car", Config.volumeVehicle)
        players = updateSpeakers(players, PrimaryShortRadioModuleInstance:getSpeakers(), "radio-primary-sr", Config.volumeRadioPrimaryShort)
        players = updateSpeakers(players, PrimaryLongRadioModuleInstance:getSpeakers(), "radio-primary-lr", Config.volumeRadioPrimaryLong)
        players = updateSpeakers(players, SecondaryShortRadioModuleInstance:getSpeakers(), "radio-secondary-sr", Config.volumeRadioSecondaryShort)
        players = updateSpeakers(players, SecondaryLongRadioModuleInstance:getSpeakers(), "radio-secondary-lr", Config.volumeRadioSecondaryLong)
        players = updateSpeakers(players, CallModuleInstance:getSpeakers(), "call", Config.volumeCall)

        -- clear everything
        MumbleClearVoiceTarget(voiceTarget)

        -- readd channel
        for _, channelId in pairs(channels) do
            MumbleAddVoiceTargetChannel(voiceTarget, channelId)
            print("Add Mumble Channel ", voiceTarget, channelId)
        end

        -- readd players
        for serverId, config in pairs(players) do
            MumbleAddVoiceTargetPlayerByServerId(voiceTarget, serverId)
            MumbleSetVolumeOverrideByServerId(serverId, config.volume)
            print("Add Mumble Player ", voiceTarget, serverId, config.volume)
        end

        -- wait, do this every 200ms
        Citizen.Wait(200)
    end
end)

local voiceTarget = 1

CallModuleInstance = ModuleCall:new(Config.volumeCall)
PrimaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "short", "PrimaryShort")
PrimaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "long", "PrimaryLong")
SecondaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "short", "SecondaryShort")
SecondaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "long", "SecondaryLong")
CarModuleInstance = ModuleCar:new(Config.volumeVehicle)
ProximityModuleInstance = ModuleProximityCulling:new(Config.normalRange, Config.gridSize, Config.gridEdge)

local function updateSpeakers(speakers, newSpeakers, context, volume)
    for id, config in pairs(newSpeakers) do
        if speakers[id] then
            speakers[id].volume = volume
            speakers[id].serverId = config.serverId,
            table.insert(speakers[id].context, context)
        else
            speakers[id] = {
                serverId = config.serverId,
                volume = volume,
                context = { context },
            }
        end
    end

    return speakers
end

local function RefreshStrategy(currentState, nextState)
    -- clear everything
    MumbleClearVoiceTarget(voiceTarget)

    -- readd channel
    for _, channelId in pairs(nextState.channels) do
        MumbleAddVoiceTargetChannel(voiceTarget, channelId)
    end

    -- readd players
    for _, config in pairs(nextState.players) do
        MumbleAddVoiceTargetPlayerByServerId(voiceTarget, config.serverId)
        MumbleSetVolumeOverrideByServerId(config.serverId, config.volume)
    end

    return nextState
end

-- @TODO
local function DiffStrategy(currentState, nextState)
    return nextState
end

Citizen.CreateThread(function()
    CarModuleInstance:init()
    ProximityModuleInstance:init()
    PrimaryShortRadioModuleInstance:init()
    PrimaryLongRadioModuleInstance:init()
    SecondaryShortRadioModuleInstance:init()
    SecondaryLongRadioModuleInstance:init()

    MumbleSetVoiceTarget(voiceTarget)

    local currentState = {
        players = {},
        channels = {},
    }

    local Strategy = RefreshStrategy

    while true do
        -- first refresh state of proximity
        ProximityModuleInstance:refresh()

        -- get all speakers and channels

        local nextState = {
            players = {},
            channels = {},
        }

        nextState.channels = ProximityModuleInstance:getChannels()
        nextState.players = {}

        for _, data in pairs(ProximityModuleInstance:getSpeakers()) do
            players[("player_%d"):format(data.serverId)] = {
                serverId = data.serverId,
                volume = -1.0,
                context = { "proximity" }
            }
        end

        nextState.players = updateSpeakers(nextState.players, CarModuleInstance:getSpeakers(), "car", Config.volumeVehicle)
        nextState.players = updateSpeakers(nextState.players, PrimaryShortRadioModuleInstance:getSpeakers(), "radio-primary-sr", Config.volumeRadioPrimaryShort)
        nextState.players = updateSpeakers(nextState.players, PrimaryLongRadioModuleInstance:getSpeakers(), "radio-primary-lr", Config.volumeRadioPrimaryLong)
        nextState.players = updateSpeakers(nextState.players, SecondaryShortRadioModuleInstance:getSpeakers(), "radio-secondary-sr", Config.volumeRadioSecondaryShort)
        nextState.players = updateSpeakers(nextState.players, SecondaryLongRadioModuleInstance:getSpeakers(), "radio-secondary-lr", Config.volumeRadioSecondaryLong)
        nextState.players = updateSpeakers(nextState.players, CallModuleInstance:getSpeakers(), "call", Config.volumeCall)

        -- @TODO Filters

        currentState = Strategy(currentState, nextState)

        -- wait, do this every 200ms
        Citizen.Wait(200)
    end
end)

local voiceTarget = 1

CallModuleInstance = ModuleCall:new(Config.volumeCall)
PrimaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-sr", "PrimaryShort")
PrimaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-lr", "PrimaryLong")
SecondaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-sr", "SecondaryShort")
SecondaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-lr", "SecondaryLong")
CarModuleInstance = ModuleCar:new(Config.volumeVehicle)
ProximityModuleInstance = ModuleProximityCulling:new(Config.normalRange, Config.gridSize, Config.gridEdge)

local function updateSpeakers(speakers, newSpeakers, context, volume)
    for id, config in pairs(newSpeakers) do
        if speakers[id] then
            speakers[id].serverId = config.serverId
            speakers[id].volume = volume
            speakers[id].distance = config.distance or speakers[id].distance
            speakers[id].distanceMax = config.distanceMax or speakers[id].distanceMax
            speakers[id].balanceLeft = config.balanceLeft or speakers[id].balanceLeft
            speakers[id].balanceRight = config.balanceRight or speakers[id].balanceRight

            table.insert(speakers[id].context, context)
        else
            speakers[id] = {
                serverId = config.serverId,
                volume = volume,
                distance = config.distance or 0,
                distanceMax = config.distanceMax or 0,
                balanceLeft = (config.balanceLeft or 1.0),
                balanceRight = (config.balanceRight or 1.0),
                context = {context},
            }
        end
    end

    return speakers
end

local function contains(table, value)
    for _, val in pairs(table) do
        if val == value then
            return true
        end
    end

    return false
end

local function RefreshState(state)
    -- clear everything
    MumbleClearVoiceTarget(voiceTarget)

    -- readd channel
    for _, channelId in pairs(state.channels) do
        MumbleAddVoiceTargetChannel(voiceTarget, channelId)
    end

    -- readd players
    for _, config in pairs(state.players) do
        MumbleAddVoiceTargetPlayerByServerId(voiceTarget, config.serverId)
        MumbleSetVolumeOverrideByServerId(config.serverId, config.volume)
    end

    return state
end

local FilterRegistryInstance = FilterAudiocontextRegistry:new()

local function GetFilterForPlayer(player)
    if contains(player.context, "call") then
        return "call"
    end

    if contains(player.context, "radio_lr_primary") then
        return "radio"
    end

    if contains(player.context, "radio_lr_secondary") then
        return "radio"
    end

    if contains(player.context, "radio_sr_primary") then
        return "radio"
    end

    if contains(player.context, "radio_sr_secondary") then
        return "radio"
    end

    return nil
end

local function ApplyFilters(players)
    local toRemove = {}

    FilterRegistryInstance:loop(function(id)
        if not players[id] then
            table.insert(toRemove, id)
        end
    end)

    for _, toRemoveId in pairs(toRemove) do
        FilterRegistryInstance:removeById(toRemoveId)
    end

    for _, player in pairs(players) do
        local filterType = GetFilterForPlayer(player)

        if filterType == nil then
            FilterRegistryInstance:remove(player.serverId)
        else
            FilterRegistryInstance:apply(player.serverId, filterType, player)
        end
    end
end

Citizen.CreateThread(function()
    CarModuleInstance:init()
    ProximityModuleInstance:init()
    PrimaryShortRadioModuleInstance:init()
    PrimaryLongRadioModuleInstance:init()
    SecondaryShortRadioModuleInstance:init()
    SecondaryLongRadioModuleInstance:init()

    MumbleSetVoiceTarget(voiceTarget)
    MumbleClearVoiceTarget(voiceTarget)
    MumbleSetTalkerProximity(Config.normalRange)

    while true do
        -- first refresh state of proximity
        ProximityModuleInstance:refresh()

        -- get all speakers and channels
        local state = {players = {}, channels = {}}

        state.channels = ProximityModuleInstance:getChannels()
        state.players = {}

        for _, data in pairs(ProximityModuleInstance:getSpeakers()) do
            state.players[("player_%d"):format(data.serverId)] = {
                serverId = data.serverId,
                volume = -1.0,
                context = {"proximity"},
            }
        end

        state.players = updateSpeakers(state.players, CarModuleInstance:getSpeakers(), "car", Config.volumeVehicle)
        state.players = updateSpeakers(state.players, SecondaryShortRadioModuleInstance:getSpeakers(), "radio_sr_secondary", Config.volumeRadioSecondaryShort)
        state.players = updateSpeakers(state.players, PrimaryShortRadioModuleInstance:getSpeakers(), "radio_sr_primary", Config.volumeRadioPrimaryShort)
        state.players = updateSpeakers(state.players, SecondaryLongRadioModuleInstance:getSpeakers(), "radio_lr_secondary", Config.volumeRadioSecondaryLong)
        state.players = updateSpeakers(state.players, PrimaryLongRadioModuleInstance:getSpeakers(), "radio_lr_primary", Config.volumeRadioPrimaryLong)
        state.players = updateSpeakers(state.players, CallModuleInstance:getSpeakers(), "call", Config.volumeCall)

        RefreshState(state)

        ApplyFilters(state.players)

        -- wait, do this every 200ms
        Citizen.Wait(200)
    end
end)

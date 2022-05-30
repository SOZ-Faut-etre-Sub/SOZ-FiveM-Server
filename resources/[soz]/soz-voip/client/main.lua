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
            speakers[id].serverId = config.serverId, table.insert(speakers[id].context, context)
        else
            speakers[id] = {serverId = config.serverId, volume = volume, context = {context}}
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

local Filters = {}

local function CreateFilterAndConnect(filterType, serverId)
    if filterType == "phone" then
        local filter = FilterPhone:new(serverId)
        filter:connect()

        return filter
    end

    if filterType == "radio" then
        local filter = FilterRadio:new(serverId)
        filter:connect()

        return filter
    end

    return nil
end

local function SafeCreateFilterAndConnect(filterType, serverId)
    local status, res = pcall(CreateFilterAndConnect, filterType, serverId)

    if status then
        return res
    end

    print(("cannot create audio filter %s, for player %d : %s"):format(filterType, serverId, tostring(res)))

    return nil
end

local function DiffStrategy(currentState, nextState)
    local toDisconnect = {}
    local toUpdate = {}
    local toAdd = {}

    for id, player in pairs(currentState.players) do
        if not nextState.players[id] then
            toDisconnect[id] = player
        else
            toUpdate[id] = player
        end
    end

    for id, player in pairs(nextState.players) do
        if not currentState.players[id] then
            toAdd[id] = player
        end
    end

    for id, player in pairs(toDisconnect) do
        MumbleRemoveVoiceTargetPlayerByServerId(voiceTarget, player.serverId)

        if Filters[id] then
            Filters[id]:delete()
            Filters[id] = nil
        end
    end

    for id, player in pairs(toUpdate) do
        MumbleSetVolumeOverrideByServerId(player.serverId, player.volume)

        -- Update filter case
        if Filters[id] and Filters[id]:getType() == player.filter then
            Filters[id]:update(player)
        end

        -- Remove filter (like in proximity and call, and ending call)
        if Filters[id] and Filters[id]:getType() ~= player.filter then
            Filters[id]:delete()
            Filters[id] = nil
        end

        -- Add filter (like in radio and call, ending call, remove call filter, but readd radio one)
        if not Filters[id] and player.filter then
            Filters[id] = SafeCreateFilterAndConnect(player.filter, player.serverId)
        end
    end

    for id, player in pairs(toAdd) do
        MumbleAddVoiceTargetPlayerByServerId(voiceTarget, player.serverId)
        MumbleSetVolumeOverrideByServerId(player.serverId, player.volume)

        if Filters[id] then
            Filters[id]:delete()
            Filters[id] = nil
        end

        if player.filter then
            Filters[id] = SafeCreateFilterAndConnect(player.filter, player.serverId)
        end
    end

    return nextState
end

local function AddFilters(players)
    for _, player in pairs(players) do
        player.filter = nil

        local isCall = false
        local isRadio = false

        for _, context in pairs(player.context) do
            if context == "call" then
                isCall = true
            end

            if context == "radio-primary-sr" or context == "radio-primary-lr" or context == "radio-secondary-sr" or context == "radio-secondary-lr" then
                isRadio = true
            end
        end

        if isRadio then
            player.filter = "radio"
        end

        if isCall then
            player.filter = "phone"
        end
    end

    return players
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

    local currentState = {players = {}, channels = {}}
    local Strategy = DiffStrategy

    while true do
        -- first refresh state of proximity
        ProximityModuleInstance:refresh()

        -- get all speakers and channels

        local nextState = {players = {}, channels = {}}

        nextState.channels = ProximityModuleInstance:getChannels()
        nextState.players = {}

        for _, data in pairs(ProximityModuleInstance:getSpeakers()) do
            nextState.players[("player_%d"):format(data.serverId)] = {
                serverId = data.serverId,
                volume = -1.0,
                context = {"proximity"},
            }
        end

        nextState.players = updateSpeakers(nextState.players, CarModuleInstance:getSpeakers(), "car", Config.volumeVehicle)
        nextState.players = updateSpeakers(nextState.players, PrimaryShortRadioModuleInstance:getSpeakers(), "radio-primary-sr", Config.volumeRadioPrimaryShort)
        nextState.players = updateSpeakers(nextState.players, PrimaryLongRadioModuleInstance:getSpeakers(), "radio-primary-lr", Config.volumeRadioPrimaryLong)
        nextState.players = updateSpeakers(nextState.players, SecondaryShortRadioModuleInstance:getSpeakers(), "radio-secondary-sr",
                                           Config.volumeRadioSecondaryShort)
        nextState.players = updateSpeakers(nextState.players, SecondaryLongRadioModuleInstance:getSpeakers(), "radio-secondary-lr",
                                           Config.volumeRadioSecondaryLong)
        nextState.players = updateSpeakers(nextState.players, CallModuleInstance:getSpeakers(), "call", Config.volumeCall)

        nextState.players = AddFilters(nextState.players)

        currentState = Strategy(currentState, nextState)

        -- wait, do this every 200ms
        Citizen.Wait(200)
    end
end)

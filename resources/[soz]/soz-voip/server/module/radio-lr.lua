--- @class RadioLongRange
local RadioLongRange = {}

function RadioLongRange.new()
    return setmetatable({}, {__index = RadioLongRange})
end

function RadioLongRange:addPlayer(source, channel)
    voiceStateBackend["radio"]:addConsumer(source, channel)

    if not voiceStateBackend["radio"]:canJoinChannel(source, channel) then
        return TriggerClientEvent("voip:client:removeConsumer", source, "radio-lr", source)
    end

    local players = voiceStateBackend["radio"]:getConsumers(channel)
    for player, _ in pairs(players) do
        TriggerClientEvent("voip:client:addConsumer", player, "radio-lr", source)
    end

    TriggerClientEvent("voip:client:syncConsumers", source, "radio-lr", players)
end

function RadioLongRange:setPlayer(source, channel, isPrimary)
    local state = Player(source).state["radio-lr"]
    channel = tonumber(channel)

    self:removePlayer(source, isPrimary and state.primaryChannel or state.secondaryChannel)

    if isPrimary then
        state.primaryChannel = channel
    else
        state.secondaryChannel = channel
    end
    Player(source).state["radio-lr"] = state

    if channel ~= 0 then
        self:addPlayer(source, channel)
    end
end

function RadioLongRange:removePlayer(source, channel)
    voiceStateBackend["radio"]:removeConsumer(source, channel)

    for player, _ in pairs(voiceStateBackend["radio"]:getConsumers(channel)) do
        TriggerClientEvent("voip:client:removeConsumer", player, "radio-lr", source)
    end
end

function RadioLongRange:setTalking(source, talking, isPrimary)
    local channel = Player(source).state["radio-lr"][isPrimary and "primaryChannel" or "secondaryChannel"]
    local players = voiceStateBackend["radio"]:updateConsumerState(source, channel, talking)

    if players then
        for player, _ in pairs(players) do
            if player ~= source then
                TriggerClientEvent("voip:client:updateConsumer", player, "radio-lr", source, talking, channel)
            end
        end
    end
end

--- Exports functions
voiceModule["radio-lr"] = RadioLongRange.new()

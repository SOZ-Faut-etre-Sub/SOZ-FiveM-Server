--- @class RadioShortRange
local RadioShortRange = {}

function RadioShortRange.new()
    return setmetatable({}, {__index = RadioShortRange})
end

function RadioShortRange:addPlayer(source, channel)
    voiceStateBackend["radio"]:addConsumer(source, channel)

    if not voiceStateBackend["radio"]:canJoinChannel(source, channel) then
        return TriggerClientEvent("voip:client:removeConsumer", source, "radio-sr", source)
    end

    local players = voiceStateBackend["radio"]:getConsumers(channel)
    for player, _ in pairs(players) do
        TriggerClientEvent("voip:client:addConsumer", player, "radio-sr", source)
    end

    TriggerClientEvent("voip:client:syncConsumers", source, "radio-sr", players)
end

function RadioShortRange:setPlayer(source, channel, isPrimary)
    local state = Player(source).state["radio-sr"]
    channel = tonumber(channel)

    self:removePlayer(source, isPrimary and state.primaryChannel or state.secondaryChannel)

    if isPrimary then
        state.primaryChannel = channel
    else
        state.secondaryChannel = channel
    end
    Player(source).state["radio-sr"] = state

    if channel ~= 0 then
        self:addPlayer(source, channel)
    end
end

function RadioShortRange:removePlayer(source, channel)
    voiceStateBackend["radio"]:removeConsumer(source, channel)

    for player, _ in pairs(voiceStateBackend["radio"]:getConsumers(channel)) do
        TriggerClientEvent("voip:client:removeConsumer", player, "radio-sr", source)
    end
end

function RadioShortRange:setTalking(source, talking, isPrimary)
    local channel = Player(source).state["radio-sr"][isPrimary and "primaryChannel" or "secondaryChannel"]
    local players = voiceStateBackend["radio"]:updateConsumerState(source, channel, talking)

    if players then
        local sourcePlayerCoords = GetEntityCoords(GetPlayerPed(source))

        for player, _ in pairs(players) do
            if player ~= source then
                if #(sourcePlayerCoords - GetEntityCoords(GetPlayerPed(player))) <= Config.ShortRangeRadio then
                    TriggerClientEvent("voip:client:updateConsumer", player, "radio-sr", source, talking, channel)
                end
            end
        end
    end
end

--- Exports functions
voiceModule["radio-sr"] = RadioShortRange.new()

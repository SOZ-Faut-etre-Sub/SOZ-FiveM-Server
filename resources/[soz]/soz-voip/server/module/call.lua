--- @class PhoneCall
local PhoneCall = {}

function PhoneCall.new()
    return setmetatable({}, {__index = PhoneCall})
end

function PhoneCall:addPlayer(source, channel)
    voiceStateBackend["call"]:addConsumer(source, channel)

    local players = voiceStateBackend["call"]:getConsumers(channel)
    for player, _ in pairs(players) do
        if player ~= source then
            TriggerClientEvent("voip:client:addConsumer", player, "call", source)
        end
    end

    TriggerClientEvent("voip:client:syncConsumers", source, "call", players)
end

function PhoneCall:setPlayer(source, channel)
    channel = tonumber(channel)
    Player(source).state.call.channel = channel

    if channel ~= 0 then
        self:removePlayer(source, channel)
        self:addPlayer(source, channel)
    elseif channel == 0 then
        self:removePlayer(source, channel)
    end
end

function PhoneCall:removePlayer(source, channel)
    voiceStateBackend["call"]:removeConsumer(source, channel)

    for player, _ in pairs(voiceStateBackend["call"]:getConsumers(channel)) do
        TriggerClientEvent("voip:client:removeConsumer", player, "call", source)
    end
end

function PhoneCall:setTalking(source, talking)
    local players = voiceStateBackend["call"]:updateConsumerState(source, Player(source).state.call.channel, talking)

    if players then
        for player, _ in pairs(players) do
            if player ~= source then
                TriggerClientEvent("voip:client:updateConsumer", player, "call", source, talking)
            end
        end
    end
end

--- Exports functions
voiceModule["call"] = PhoneCall.new()

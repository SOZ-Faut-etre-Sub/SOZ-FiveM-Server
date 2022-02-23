--- @class VoicePhone
VoicePhone = {}

function VoicePhone.new()
    return setmetatable({}, {
        __index = VoicePhone,
        __tostring = function()
            return "VoicePhone"
        end,
    })
end

function VoicePhone:addPlayer(source, channel)
    callData[channel] = callData[channel] or {}
    for player, _ in pairs(callData[channel]) do
        if player ~= source then
            TriggerClientEvent("pma-voice:addPlayerToCall", player, source)
        end
    end
    callData[channel][source] = false
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()
    voiceData[source].call = channel
    TriggerClientEvent("pma-voice:syncCallData", source, callData[channel])
end

function VoicePhone:setPlayer(source, channel)
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()
    local isResource = GetInvokingResource()
    local plyVoice = voiceData[source]
    channel = tonumber(channel)
    if isResource then
        TriggerClientEvent("pma-voice:clSetPlayerCall", source, channel)
    end

    Player(source).state.callChannel = channel

    if channel ~= 0 and plyVoice.call == 0 then
        self:addPlayer(source, channel)
    elseif channel == 0 then
        self:removePlayer(source, plyVoice.call)
    elseif plyVoice.call > 0 then
        self:removePlayer(source, plyVoice.call)
        self:addPlayer(source, channel)
    end
end

function VoicePhone:removePlayer(source, channel)
    callData[channel] = callData[channel] or {}
    for player, _ in pairs(callData[channel]) do
        TriggerClientEvent("pma-voice:removePlayerFromCall", player, source)
    end
    callData[channel][source] = nil
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()
    voiceData[source].call = 0
end

function VoicePhone:setTalking(source, talking)
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()
    local callTbl = callData[voiceData[source].call]
    if callTbl then
        for player, _ in pairs(callTbl) do
            if player ~= source then
                TriggerClientEvent("pma-voice:setTalkingOnCall", player, source, talking)
            end
        end
    end
end

--- Exports functions
setmetatable(VoicePhone, {__index = VoiceModuleShell})
voiceModule["call"] = VoicePhone.new()

--- OLD
exports("setPlayerCall", function(source, channel)
    VoicePhone:setPlayer(source, channel)
end)

RegisterNetEvent("pma-voice:setPlayerCall", function(channel)
    VoicePhone:setPlayer(source, channel)
end)

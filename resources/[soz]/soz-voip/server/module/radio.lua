--- @class VoiceRadio
VoiceRadio = {}

local radioChecks = {}

function VoiceRadio.new()
    return setmetatable({}, {
        __index = VoiceRadio,
        __tostring = function()
            return "VoiceRadio"
        end,
    })
end

function VoiceRadio:canJoinChannel(source, channel)
    if radioChecks[channel] then
        return radioChecks[channel](source)
    end
    return true
end

function VoiceRadio:addChannelCheck(channel, cb)
    local channelType = type(channel)
    local cbType = type(cb)
    if channelType ~= "number" then
        error(("'channel' expected 'number' got '%s'"):format(channelType))
    end
    if cbType ~= "table" or not cb.__cfx_functionReference then
        error(("'cb' expected 'function' got '%s'"):format(cbType))
    end
    radioChecks[channel] = cb
end

function VoiceRadio:addPlayer(source, channel, isPrimary)
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()
    radioData[channel] = radioData[channel] or {}

    if not self:canJoinChannel(source, channel) then
        return TriggerClientEvent("pma-voice:removePlayerFromRadio", source, source)
    end

    for player, _ in pairs(radioData[channel]) do
        TriggerClientEvent("pma-voice:addPlayerToRadio", player, source, isPrimary)
    end
    if isPrimary then
        voiceData[source].primaryRadio = channel
    else
        voiceData[source].secondaryRadio = channel
    end
    radioData[channel][source] = false

    TriggerClientEvent("pma-voice:syncRadioData", source, radioData[channel], isPrimary)
end

function VoiceRadio:setPlayer(source, channel, isPrimary)
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()
    channel = tonumber(channel)

    local playerVoice = voiceData[source]
    if GetInvokingResource() then
        TriggerClientEvent("pma-voice:clSetPlayerRadio", source, channel, isPrimary)
    end

    if isPrimary then
        Player(source).state.primaryRadioChannel = channel
        playerVoice = playerVoice.primaryRadio
    else
        Player(source).state.secondaryRadioChannel = channel
        playerVoice = playerVoice.secondaryRadio
    end

    if channel ~= 0 and playerVoice == 0 then
        self:addPlayer(source, channel, isPrimary)
    elseif channel == 0 then
        self:removePlayer(source, playerVoice, isPrimary)
    elseif playerVoice > 0 then
        self:removePlayer(source, playerVoice, isPrimary)
        self:addPlayer(source, channel, isPrimary)
    end
end

function VoiceRadio:removePlayer(source, channel, isPrimary)
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()
    radioData[channel] = radioData[channel] or {}

    for player, _ in pairs(radioData[channel]) do
        TriggerClientEvent("pma-voice:removePlayerFromRadio", player, source)
    end

    radioData[channel][source] = nil
    if isPrimary then
        voiceData[source].primaryRadio = 0
    else
        voiceData[source].secondaryRadio = 0
    end
end

function VoiceRadio:setTalking(source, talking, isPrimary)
    voiceData[source] = voiceData[source] or defaultVoiceDataTable()

    local plyVoice = voiceData[source]
    local radioTbl = radioData[plyVoice.primaryRadio]

    if not isPrimary then
        radioTbl = radioData[plyVoice.secondaryRadio]
    end

    if radioTbl then
        radioTbl[source] = talking
        for player, _ in pairs(radioTbl) do
            if player ~= source then
                TriggerClientEvent("pma-voice:setTalkingOnRadio", player, source, talking, isPrimary)
            end
        end
    end
end

--- Exports functions
setmetatable(VoiceRadio, {__index = VoiceModuleShell})
voiceModule["radio"] = VoiceRadio.new()

--- FiveM Exports function
exports("addChannelCheck", function(channel, cb)
    VoiceRadio:addChannelCheck(channel, cb)
end)

exports("setPlayerRadio", function(source, channel)
    VoiceRadio:setPlayer(source, channel)
end)

RegisterNetEvent("pma-voice:setPlayerRadio", function(channel, isPrimary)
    VoiceRadio:setPlayer(source, channel, isPrimary)
end)

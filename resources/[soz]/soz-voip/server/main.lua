QBCore = exports["qb-core"]:GetCoreObject()
SOZVoice = {}

SOZVoice.players = {}

SOZVoice.getAllPlayers = function()
    return SOZVoice.players
end

SOZVoice.getPlayer = function(_src)
    return SOZVoice.players[_src]
end

SOZVoice.getOrCreatePlayer = function(_src)
    if not SOZVoice.players[_src] then
        return VoicePlayer:new(_src)
    end
    return SOZVoice.players[_src]
end

SOZVoice.playerExists = function(_src)
    return SOZVoice.players[_src] ~= nil
end

SOZVoice.removePlayer = function(_src)
    SOZVoice.players[_src] = nil
end

SOZVoice.createPlayer = function(_src)
    SOZVoice.players[_src] = VoicePlayer:new(_src)
end

-- If resource is restarted, we need to reset all players
CreateThreadNow(function()
    for _src, _ in pairs(QBCore.Players) do
        SOZVoice.createPlayer(_src)
    end
end)
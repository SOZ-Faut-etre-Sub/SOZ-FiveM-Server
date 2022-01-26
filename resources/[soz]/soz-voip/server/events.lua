AddEventHandler('playerJoining', function()
    local _src = source
    if not SOZVoice.playerExists(_src) then
        SOZVoice.createPlayer(_src)
    end
end)

AddEventHandler("playerDropped", function()
    local _src = source
    if SOZVoice.playerExists(_src) then
        SOZVoice.playerJoin(source)
    end
end)
RegisterNetEvent("voip:server:setPlayerInChannel", function(module, channel, extra)
    voiceModule[module]:setPlayer(source, channel, extra)
end)

RegisterNetEvent("voip:server:setPlayerTalking", function(module, talking, extra)
    voiceModule[module]:setTalking(source, talking, extra)
end)

RegisterNetEvent("voip:server:muteMe", function(mute)
    TriggerClientEvent("voip:client:mutePlayer", -1, source, mute)
end)

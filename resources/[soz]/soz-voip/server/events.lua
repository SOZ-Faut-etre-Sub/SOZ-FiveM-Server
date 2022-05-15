RegisterNetEvent("voip:server:setPlayerInChannel", function(module, channel, extra)
    voiceModule[module]:setPlayer(source, channel, extra)
end)

RegisterNetEvent("voip:server:setPlayerTalking", function(module, talking, extra)
    voiceModule[module]:setTalking(source, talking, extra)
end)

RegisterNetEvent("voip:server:muteMe", function(mute)
    MumbleSetPlayerMuted(source, mute)
end)

--- Sync items
RegisterNetEvent("voip:server:setPlayerWithMegaphone", function(enabled)
    TriggerClientEvent("voip:client:setPlayerWithMegaphone", -1, source, enabled)
end)

RegisterNetEvent("voip:server:setPlayerWithMicrophone", function(enabled)
    TriggerClientEvent("voip:client:setPlayerWithMicrophone", -1, source, enabled)
end)

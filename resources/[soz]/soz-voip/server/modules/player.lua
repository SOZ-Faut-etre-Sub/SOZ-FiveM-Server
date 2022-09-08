--- Functions
RegisterNetEvent("voip:server:player:mute", function(mute, target)
    ZumbleSetPlayerMuted(target or source, mute)
end)

QBCore.Functions.CreateCallback("voip:server:player:isMuted", function(source, cb, target)
    cb(ZumbleIsPlayerMuted(target or source))
end)

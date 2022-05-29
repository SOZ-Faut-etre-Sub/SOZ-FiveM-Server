--- Functions
RegisterNetEvent("voip:server:player:mute", function(mute, target)
    MumbleSetPlayerMuted(target or source, mute)
end)

QBCore.Functions.CreateCallback("voip:server:player:isMuted", function(source, cb, target)
    cb(MumbleIsPlayerMuted(target or source))
end)

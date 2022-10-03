local http_endpoint = GetConvar("soz_voip_mumble_http_endpoint", "")

--- Functions
RegisterNetEvent("voip:server:player:mute", function(mute, target)
    if http_endpoint ~= "" then
        ZumbleSetPlayerMuted(target or source, mute)
    else
        MumbleSetPlayerMuted(target or source, mute)
    end
end)

QBCore.Functions.CreateCallback("voip:server:player:isMuted", function(source, cb, target)
    if http_endpoint ~= "" then
        cb(ZumbleIsPlayerMuted(target or source))
    else
        cb(MumbleIsPlayerMuted(target or source))
    end
end)

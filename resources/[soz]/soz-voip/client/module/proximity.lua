-- used when muted
local disableUpdates = false
local plyCoords = GetEntityCoords(PlayerPedId())

function orig_addProximityCheck(ply)
    local tgtPed = GetPlayerPed(ply)

    return #(plyCoords - GetEntityCoords(tgtPed)) < Config.VoiceModes[CurrentPlayer.VoiceMode]
end

function addNearbyPlayers()
    if disableUpdates then
        return
    end
    -- update here so we don't have to update every call of addProximityCheck
    plyCoords = GetEntityCoords(PlayerPedId())

    MumbleClearVoiceTargetChannels(Config.VoiceTarget)
    local players = GetActivePlayers()
    for i = 1, #players do
        local ply = players[i]
        local serverId = GetPlayerServerId(ply)

        if serverId == CurrentPlayer.ServerId then
            goto skip_loop
        end

        if orig_addProximityCheck(ply) then
            if isTarget then
                goto skip_loop
            end

            MumbleAddVoiceTargetChannel(Config.VoiceTarget, serverId)
        end

        ::skip_loop::
    end
end

function setSpectatorMode(enabled)
    CurrentPlayer.IsListenerEnabled = enabled
    local players = GetActivePlayers()
    if CurrentPlayer.IsListenerEnabled then
        for i = 1, #players do
            local ply = players[i]
            local serverId = GetPlayerServerId(ply)
            if serverId == CurrentPlayer.ServerId then
                goto skip_loop
            end
            MumbleAddVoiceChannelListen(serverId)
            ::skip_loop::
        end
    else
        for i = 1, #players do
            local ply = players[i]
            local serverId = GetPlayerServerId(ply)
            if serverId == CurrentPlayer.ServerId then
                goto skip_loop
            end
            MumbleRemoveVoiceChannelListen(serverId)
            ::skip_loop::
        end
    end
end

Citizen.CreateThread(function()
    while true do
        while not MumbleIsConnected() do
            Wait(100)
        end

        addNearbyPlayers()
        local isSpectating = NetworkIsInSpectatorMode()
        if isSpectating and not CurrentPlayer.IsListenerEnabled then
            setSpectatorMode(true)
        elseif not isSpectating and CurrentPlayer.IsListenerEnabled then
            setSpectatorMode(false)
        end

        Wait(200)
    end
end)

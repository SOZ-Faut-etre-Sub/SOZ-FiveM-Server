local plyCoords = GetEntityCoords(PlayerPedId())

local playerWithMegaphone = {}
local playerWithMicrophone = {}

function orig_addProximityCheck(ply)
    local tgtPed = GetPlayerPed(ply)
    local voiceRange = Config.VoiceModes[CurrentPlayer.VoiceMode]

    if playerWithMegaphone[CurrentPlayer.ServerId] then
        voiceRange = Config.Megaphone.Range
    elseif playerWithMicrophone[CurrentPlayer.ServerId] then
        voiceRange = Config.Microphone.Range
    end

    return #(plyCoords - GetEntityCoords(tgtPed)) <= voiceRange
end

function addNearbyPlayers()
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
            MumbleAddVoiceTargetChannel(Config.VoiceTarget, serverId)
        end

        if playerWithMegaphone[serverId] then
            ApplySubmixEffect("megaphone", serverId)
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

RegisterNetEvent("voip:client:setPlayerWithMegaphone", function(player, enabled)
    print("setPlayerWithMegaphone", player, enabled)
    playerWithMegaphone[player] = enabled
end)

RegisterNetEvent("voip:client:setPlayerWithMicrophone", function(player, enabled)
    print("setPlayerWithMicrophone", player, enabled)
    playerWithMicrophone[player] = enabled
end)

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

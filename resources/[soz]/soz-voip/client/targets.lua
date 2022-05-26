Targets = Context:new()
local debugShow = 1

function IsPlayerInTargetChannel(serverID)
    local gridChannel = GetGridChannel(NetworkGetPlayerCoords(serverID or 0), Config.gridSize)
    return Channels:targetHasAnyActiveContext(gridChannel) == true
end

function SetVoiceTargets(targetID)
    local players, channels = {}, {}

    Channels:contextIterator(function(channel)
        if not channels[channel] then
            channels[channel] = true
            MumbleAddVoiceTargetChannel(targetID, channel)
            if debugShow == 50 then
                console.debug("[Main] MumbleAddVoiceTargetChannel(%s, %s)", targetID, channel)
            end
        end
    end)

    Targets:contextIterator(function(serverID)
        if not players[serverID] and not IsPlayerInTargetChannel(serverID) then
            players[serverID] = true
            MumbleAddVoiceTargetPlayerByServerId(targetID, serverID)
            if debugShow == 50 then
                console.debug("[Main] MumbleAddVoiceTargetPlayerByServerId(%s, %s)", targetID, serverID)
            end
        end
    end)
end

function ChangeVoiceTarget(targetID)
    PlayerData.CurrentTarget = targetID
    MumbleSetVoiceTarget(targetID)
    if debugShow == 50 then
        console.debug("[Main] MumbleSetVoiceTarget(%s)", targetID)
    end
end

function RefreshTargets()
    local voiceTarget = PlayerData.CurrentTarget

    MumbleClearVoiceTarget(voiceTarget)
    if debugShow == 50 then
        console.debug("[Main] MumbleClearVoiceTarget(%s)", voiceTarget)
    end
    MumbleClearVoiceTargetPlayers(voiceTarget)
    if debugShow == 50 then
        console.debug("[Main] MumbleClearVoiceTargetPlayers(%s)", voiceTarget)
    end
    SetVoiceTargets(voiceTarget)
    ChangeVoiceTarget(voiceTarget)

    if debugShow == 50 then
        debugShow = 0
    end
    debugShow = debugShow + 1
end

function AddPlayerToTargetList(serverID, context, transmit)
    if Targets:targetContextExist(serverID, context) then
        return
    end

    if transmit then
        TriggerServerEvent("voip:server:transmission:state", serverID, context, true, false)
    end

    if not Targets:targetHasAnyActiveContext(serverID) and PlayerData.ServerId ~= serverID then
        MumbleAddVoiceTargetPlayerByServerId(PlayerData.CurrentTarget, serverID)
    end

    Targets:add(serverID, context)

    console.debug("Added player %s to context %s", serverID, context)
end

function RemovePlayerFromTargetList(serverID, context, transmit, refresh)
    if not Targets:targetContextExist(serverID, context) then
        return
    end

    Targets:remove(serverID, context)

    if transmit then
        TriggerServerEvent("voip:server:transmission:state", serverID, context, false, false)
    end

    if refresh then
        RefreshTargets()
    end

    console.debug("Removed player %s from context %s", serverID, context)
end

function AddGroupToTargetList(group, context, channel)
    if not Targets:contextExists(context) then
        return
    end

    for serverID, active in pairs(group) do
        if active then
            AddPlayerToTargetList(serverID, context, false)
        end
    end

    TriggerServerEvent("voip:server:transmission:state", group, context, true, true, channel)
end

function RemoveGroupToTargetList(group, context, channel)
    if not Targets:contextExists(context) then
        return
    end

    for serverID, active in pairs(group) do
        if active then
            RemovePlayerFromTargetList(serverID, context, false, false)
        end
    end

    TriggerServerEvent("voip:server:transmission:state", group, context, false, true, channel)

    RefreshTargets()
end

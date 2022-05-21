Targets = Context:new()

function SetVoiceTargets(targetID)
    local players = {}

    Targets:contextIterator(function(serverID)
        if not players[serverID] then
            players[serverID] = true
            MumbleAddVoiceTargetPlayerByServerId(targetID, serverID)
        end
    end)
end

function ChangeVoiceTarget(targetID)
    PlayerData.CurrentTarget = targetID
    MumbleSetVoiceTarget(targetID)
end

function RefreshTargets()
    local voiceTarget = PlayerData.CurrentTarget

    MumbleClearVoiceTarget(voiceTarget)
    SetVoiceTargets(voiceTarget)
    ChangeVoiceTarget(voiceTarget)
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

function AddGroupToTargetList(group, context)
    if not Targets:contextExists(context) then
        return
    end

    for serverID, active in pairs(group) do
        if active then
            AddPlayerToTargetList(serverID, context, false)
        end
    end

    TriggerServerEvent("voip:server:transmission:state", group, context, true, true)
end

function RemoveGroupToTargetList(group, context)
    if not Targets:contextExists(context) then
        return
    end

    for serverID, active in pairs(group) do
        if active then
            RemovePlayerFromTargetList(serverID, context, false, false)
        end
    end

    RefreshTargets()

    TriggerServerEvent("voip:server:transmission:state", group, context, false, true)
end

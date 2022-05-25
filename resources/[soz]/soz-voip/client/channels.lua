Channels = Context:new()

function AddChannelToTargetList(channel, context)
    if not Channels:targetContextExist(channel, context) then
        if not Channels:targetHasAnyActiveContext(channel) then
            MumbleAddVoiceTargetChannel(PlayerData.CurrentTarget, channel)
        end

        Channels:add(channel, context)

        console.debug("Added channel %s to context %s", channel, context)
    end
end

function RemoveChannelFromTargetList(channel, context, refresh)
    if Channels:targetContextExist(channel, context) then
        Channels:remove(channel, context)

        if refresh then
            RefreshTargets()
        end

        console.debug("[Main] Channel Removed | ID: %s | Context: %s ", channel, context)
    end
end

function AddChannelGroupToTargetList(group, context)
    if not Channels:contextExists(context) then
        return
    end

    for _, channel in pairs(group) do
        AddChannelToTargetList(channel, context)
    end
end

function RemoveChannelGroupFromTargetList(group, context)
    if not Channels:contextExists(context) then
        return
    end

    for _, channel in pairs(group) do
        RemoveChannelFromTargetList(channel, context, false)
    end

    RefreshTargets()
end

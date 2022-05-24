Transmissions = Context:new()

--- Functions
function GetPriorityContextData(serverID)
    local _, contexts = Transmissions:getTargetContexts(serverID)
    local context = {volume = -1.0, priority = 0}

    for _, ctx in pairs(contexts) do
        if ctx.priority >= context.priority and (ctx.volume == -1 or ctx.volume >= context.volume) then
            context = ctx
        end
    end

    return context
end

function UpdateContextVolume(context, volume)
    Transmissions:setContextData(context, "volume", volume)

    Transmissions:contextIterator(function(targetID, tContext)
        if tContext == context then
            local ctx = GetPriorityContextData(targetID)

            MumbleSetVolumeOverrideByServerId(targetID, ctx.volume)
        end
    end)
end

--- Events
RegisterNetEvent("voip:client:voice:transmission:state", function(serverID, context, transmitting, frequency, isInRange)
    if not Transmissions:contextExists(context) then
        return
    end

    console.debug("[Main] Voice Transmission State | Server ID: %s | Context: %s | Transmitting: %s | Frequency: %s | In Range: %s", serverID, context,
                  tostring(transmitting), tostring(frequency), tostring(isInRange))

    if transmitting then
        Transmissions:add(serverID, context)
    else
        Transmissions:remove(serverID, context)
    end

    local data = GetPriorityContextData(serverID)

    if not transmitting then
        MumbleSetVolumeOverrideByServerId(serverID, data.volume)
        Citizen.Wait(0)
    end

    if context == "radio-lr" or (context == "radio-sr" and (isInRange or RadioFrequencies[frequency]:isAvailableOnLongRange())) then
        PlayRemoteRadioClick(context, transmitting, RadioFrequencies[frequency]:getVolume())
    end

    if transmitting and (context ~= "radio-sr" or (context == "radio-sr" and (isInRange or RadioFrequencies[frequency]:isAvailableOnLongRange()))) then
        Citizen.Wait(0)

        if context == "radio-sr" or context == "radio-lr" then
            data.volume = RadioFrequencies[frequency]:getVolume()
        end
        MumbleSetVolumeOverrideByServerId(serverID, data.volume)
    end

    if Config.filterAllowed[context] and Filter:canUseFilter(context, transmitting) then
        Filter:setTransmissionFilters(serverID, data)
    end

    console.debug("Transmission for %s in context %s", serverID, context, transmitting)
end)

--[[Filter = {}

function Filter:new()
    self.__index = self
    return setmetatable({chains = {}}, self)
end

function Filter:updateContextFilter(context, pSettings)
    Transmissions:setContextData(context, "filter", pSettings)

    Transmissions:contextIterator(function(targetID, pContext)
        if pContext == context then
            local ctx = GetTransmissionFilter(targetID)
            UpdateFilterNodes(targetID, ctx.filter)
        end
    end)
end

function Filter:canUseFilter(context, transmitting)
    if not PlayerData.VoiceEnabled then
        return false
    end

    if transmitting and context == "radio" and not PlayerData.IsRadioOn then
        return false
    end

    return true
end

function Filter:setTransmissionFilters(serverID, data)
    local chain = self.chains[serverID]

    if not chain and data.filter then
        self.chains[serverID] = CreateFilterChain(serverID, data)
        console.log("[Filter] Chain Created | Player: %s ", serverID)
    elseif chain and chain.active and data.filter then
        ModifyFilterChain(chain, data)
        console.log("[Filter] Chain Modified | Player: %s ", serverID)
    elseif chain and not chain.active and data.filter then
        ConnectFilterChain(chain, data)
        console.log("[Filter] Chain Connected | Player: %s ", serverID)
    elseif chain and chain.active and not data.filter then
        DisconnectFilterChain(chain)
        console.log("[Filter] Chain Disconnected | Player: %s ", serverID)
    end
end










function CreateFilterChain(serverID, data)
    local audio = CreateContextData(serverID)

    for index, filter in pairs(data.filter) do
        local node = CreateFilterNode(audio.context, filter)

        Wait(200)
        if node then
            if index == 1 then
                Citizen.Wait(0)
                AudiocontextDisconnect(audio.context, audio.destination, audio.source, 0, 0)
                Citizen.Wait(0)
                AudiocontextConnect(audio.context, node, audio.source, 0, 0)
                Citizen.Wait(0)
                AudiocontextConnect(audio.context, audio.destination, node, 0, 0)
                Citizen.Wait(0)
            else
                Citizen.Wait(0)
                AudiocontextDisconnect(audio.context, audio.destination, audio.node, 0, 0)
                Citizen.Wait(0)
                AudiocontextConnect(audio.context, node, audio.node, 0, 0)
                Citizen.Wait(0)
                AudiocontextConnect(audio.context, audio.destination, node, 0, 0)
                Citizen.Wait(0)
            end

            audio.node = node
            audio.filters[#audio.filters + 1] = { node = node, type = filter.filterType }
        end
    end

    return audio
end


function ModifyFilterChain(audio, data)
    for _, filter in pairs(audio.filters) do
        if filter and filter.settings then
            local values = filter.settings

            for _, settings in pairs(data.filter) do
                if values.filterType == settings.filterType and values.type == settings.type then
                    if settings.filterType == "biquad" then
                        SetBiquadFilterValues(filter.node, settings)
                    elseif settings.filterType == "waveshaper" then
                        SetWaveShaperCurve(filter.node, settings)
                    end
                end
            end
        end
    end
end


function ConnectFilterChain(audio)
    AudiocontextDisconnect(audio.context, audio.destination, audio.source, 0, 0)

    Citizen.Wait(100)

    for index, filter in ipairs(audio.filters) do
        if index == 1 then
            AudiocontextConnect(audio.context, filter.node, audio.source, 0, 0)
        else
            AudiocontextConnect(audio.context, filter.node, audio.filters[index - 1]["node"], 0, 0)
        end

        Citizen.Wait(200)
    end

    AudiocontextConnect(audio.context, audio.destination, audio.filters[#audio.filters]["node"], 0, 0)

    Citizen.Wait(100)

    audio.active = true
end

function DisconnectFilterChain(audio)
    local node = audio.filters[#audio.filters].node

    if node then
        AudiocontextDisconnect(audio.context, audio.destination, node, 0, 0)
        Citizen.Wait(100)
        AudiocontextConnect(audio.context, audio.destination, audio.source, 0, 0)
    end

    audio.active = false
end


function CreateContextData(playerID)
    local serverID = GetPlayerFromServerId(playerID)
    local context = NativesAudiocontext:GetForClient(serverID)
    local source = NativesAudiocontext:GetSource(context)
    local destination = NativesAudiocontext:GetDestination(context)

    local data = {
        context = context,
        source = source,
        destination = destination,
        node = destination,
        active = true,
        filters = {},
    }

    return data
end


function CreateFilterNode(context, effect)
    local node = nil

    if effect.filterType == "biquad" then
        node = CreateBipadFilter(context, effect)
    elseif effect.filterType == "waveshaper" then
        node = CreateWaveShaperFilter(context, effect)
    end

    return node
end


function CreateBipadFilter(audioContext, filterData)
    local audioNode = AudiocontextCreateBiquadfilternode(audioContext)

    SetBiquadFilterValues(audioNode, filterData)

    return audioNode
end


function SetBiquadFilterValues(node, settings)
    if settings.type then
        BiquadfilternodeSetType(node, settings.type)
    end

    if settings.frequency then
        SetAudioParameterValue(GetBiquadFrequency(node), settings.frequency)
    end

    if settings.q then
        SetAudioParameterValue(GetBiquadQuality(node), settings.q)
    end

    if settings.detune then
        SetAudioParameterValue(GetBiquadDetune(node), settings.detune)
    end

    if settings.gain then
        SetAudioParameterValue(GetBiquadGain(node), settings.gain)
    end
end

function SetWaveShaperCurve(node, settings)
    if settings.curve then
        WaveshapernodeSetCurve(node, settings.curve)
    end
end



RegisterNetEvent("voip:client:connection:state", function (serverID, isConnected)
    if not isConnected then
        DeleteFilterChain(serverID)
        console.debug("Deleted filter chain for player %s", serverID)
    end
end)

--- Register
Filter = Filter:new()
]]

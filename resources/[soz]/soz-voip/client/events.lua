RegisterNetEvent("voip:client:syncConsumers", function(module, consumers)
    voiceModule[module]:syncConsumers(consumers)
end)

RegisterNetEvent("voip:client:addConsumer", function(module, player)
    voiceModule[module]:addConsumer(player)
end)

RegisterNetEvent("voip:client:updateConsumer", function(module, player, enabled, extra)
    voiceModule[module]:updateConsumer(player, enabled, extra)
end)

RegisterNetEvent("voip:client:removeConsumer", function(module, player)
    voiceModule[module]:removeConsumer(player)
end)

--- Exports
exports("setRadioChannel", function(module, channel, isPrimary)
    TriggerServerEvent("voip:server:setPlayerInChannel", module, channel, isPrimary)
end)

exports("setCallChannel", function(callId)
    if callId ~= 0 then
        local state = LocalPlayer.state.call

        state.channel = callId
        LocalPlayer.state:set("call", state, true)
    end

    TriggerServerEvent("voip:server:setPlayerInChannel", "call", callId)
    voiceModule["call"]:createCallThread()
end)

exports("setVoiceEar", function(module, ear, extra)
    if module == "radio-sr" or module == "radio-lr" then
        local state = LocalPlayer.state[module]

        if extra then
            state.primaryChannelEar = ear
        else
            state.secondaryChannelEar = ear
        end

        LocalPlayer.state:set(module, state, true)
    end
end)

exports("setVolume", function(module, volume, extra)
    volume = tonumber(volume)

    if module == "radio-sr" or module == "radio-lr" then
        local state = LocalPlayer.state[module]

        if extra then
            state.primaryChannelVolume = volume
        else
            state.secondaryChannelVolume = volume
        end

        LocalPlayer.state:set(module, state, true)
    end
end)

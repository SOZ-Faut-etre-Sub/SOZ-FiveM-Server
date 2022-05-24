--- @class CallInterface
local CallInterface = {}

local moduleConsumers = {}

function CallInterface.new()
    return setmetatable({}, {__index = CallInterface})
end

function CallInterface:syncConsumers(consumers)
    moduleConsumers = consumers

    for player, enabled in pairs(moduleConsumers) do
        if player ~= CurrentPlayer.ServerId then
            toggleVoice(player, enabled, "call")
        end
    end
end

function CallInterface:getConsumers()
    return moduleConsumers
end

function CallInterface:addConsumer(player)
    moduleConsumers[player] = false
end

function CallInterface:updateConsumer(player, enabled)
    moduleConsumers[player] = enabled
    toggleVoice(player, enabled, "call")
end

function CallInterface:removeConsumer(player)
    if player == CurrentPlayer.ServerId then
        for consumer, _ in pairs(moduleConsumers) do
            if consumer ~= CurrentPlayer.ServerId then
                toggleVoice(consumer, false, "call")
            end
        end
        moduleConsumers = {}
        MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
        playerTargets(CurrentPlayer.RadioButtonPressed and voiceModule["radio-sr"]:getConsumers() or {}, moduleConsumers)
    else
        moduleConsumers[player] = nil
        toggleVoice(player, false, "call")
        if MumbleIsPlayerTalking(PlayerId()) then
            MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
            playerTargets(CurrentPlayer.RadioButtonPressed and voiceModule["radio-sr"]:getConsumers() or {}, moduleConsumers)
        end
    end
end

function CallInterface:createCallThread()
    Citizen.CreateThread(function()
        local changed = false
        while LocalPlayer.state.call.channel ~= 0 do
            if MumbleIsPlayerTalking(PlayerId()) and not changed then
                changed = true
                playerTargets(CurrentPlayer.RadioButtonPressed and voiceModule["radio-sr"]:getConsumers() or {}, moduleConsumers)
                TriggerServerEvent("voip:server:setPlayerTalking", "call", true)
            elseif changed and MumbleIsPlayerTalking(PlayerId()) ~= 1 then
                changed = false
                MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
                TriggerServerEvent("voip:server:setPlayerTalking", "call", false)
            end
            Wait(0)
        end
    end)
end

voiceModule["call"] = CallInterface.new()

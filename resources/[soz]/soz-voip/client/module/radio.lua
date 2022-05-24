--- @class RadioInterface
local RadioInterface = {}

local moduleConsumers = {}

function RadioInterface.new(module)
    return setmetatable({module = module}, {__index = RadioInterface})
end

function RadioInterface:syncConsumers(consumers)
    moduleConsumers = consumers

    for player, enabled in pairs(moduleConsumers) do
        if player ~= CurrentPlayer.ServerId then
            toggleVoice(player, enabled, self.module)
        end
    end
end

function RadioInterface:getConsumers()
    return moduleConsumers
end

function RadioInterface:addConsumer(player)
    moduleConsumers[player] = false
    if CurrentPlayer.RadioButtonPressed then
        playerTargets(moduleConsumers, MumbleIsPlayerTalking(PlayerId()) and voiceModule["call"]:getConsumers() or {})
    end
end

function RadioInterface:updateConsumer(player, enabled, channel)
    moduleConsumers[player] = enabled
    local state = LocalPlayer.state

    local function isPrimary()
        return state["radio-sr"].primaryChannel == channel or state["radio-lr"].primaryChannel == channel
    end

    local function isLongRange()
        return state["radio-lr"].primaryChannel == channel or state["radio-lr"].secondaryChannel == channel
    end

    toggleVoice(player, enabled, isLongRange() and "radio-lr" or "radio-sr", isPrimary() and "primary" or "secondary")
    playMicClicks(isLongRange() and "radio-lr" or "radio-sr", enabled, isPrimary())
end

function RadioInterface:removeConsumer(player)
    if player == CurrentPlayer.ServerId then
        for consumer, _ in pairs(moduleConsumers) do
            if consumer ~= CurrentPlayer.ServerId then
                toggleVoice(consumer, false, self.module)
            end
        end
        moduleConsumers = {}
        playerTargets(MumbleIsPlayerTalking(PlayerId()) and voiceModule["call"]:getConsumers() or {})
    else
        toggleVoice(player, false)
        if CurrentPlayer.RadioButtonPressed then
            playerTargets(moduleConsumers, MumbleIsPlayerTalking(PlayerId()) and voiceModule["call"]:getConsumers() or {})
        end
        moduleConsumers[player] = nil
    end
end

--- Exports functions
voiceModule["radio-sr"] = RadioInterface.new("radio-sr")
voiceModule["radio-lr"] = RadioInterface.new("radio-lr")

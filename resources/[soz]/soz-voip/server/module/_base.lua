--- @class VoiceModuleShell
VoiceModuleShell = {}

function VoiceModuleShell.new()
    return setmetatable({}, {
        __index = VoiceModuleShell,
        __tostring = function()
            return "VoiceModuleShell"
        end,
    })
end

--- Add player to voice channel
--- @param source number
--- @param channel number
function VoiceModuleShell:addPlayer(source, channel)
    error("Implementation required !")
end

--- Set player to voice channel
--- @param source number
--- @param channel number
function VoiceModuleShell:setPlayer(source, channel)
    error("Implementation required !")
end

--- Remove player to voice channel
--- @param source number
--- @param channel number
function VoiceModuleShell:removePlayer(source, channel)
    error("Implementation required !")
end

--- Send event when player talk
--- @param source number
--- @param talking boolean
function VoiceModuleShell:setTalking(source, talking)
    error("Implementation required !")
end

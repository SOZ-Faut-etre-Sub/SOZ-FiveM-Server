FilterBiquad = {}

function FilterBiquad:new(audioContext, type, settings)
    self.__index = self

    local node = AudiocontextCreateBiquadfilternode(audioContext)
    BiquadfilternodeSetType(node, type)

    if settings.frequency then
        SetAudioParameterValue(GetBiquadFrequency(node), settings.frequency)
    end

    if settings.quality then
        SetAudioParameterValue(GetBiquadQuality(node), settings.quality)
    end

    if settings.detune then
        SetAudioParameterValue(GetBiquadDetune(node), settings.detune)
    end

    if settings.gain then
        SetAudioParameterValue(GetBiquadGain(node), settings.gain)
    end

    return setmetatable({audioContext = audioContext, node = node}, self)
end

function FilterBiquad:getNode()
    return self.node
end

function FilterBiquad:setType(type)
    BiquadfilternodeSetType(self.node, type)
end

function FilterBiquad:setFrequency(frequency)
    SetAudioParameterValue(GetBiquadFrequency(self.node), frequency)
end

function FilterBiquad:setQ(q)
    SetAudioParameterValue(GetBiquadQuality(self.node), q)
end

function FilterBiquad:setDetune(detune)
    SetAudioParameterValue(GetBiquadDetune(self.node), detune)
end

function FilterBiquad:setGain(gain)
    SetAudioParameterValue(GetBiquadGain(self.node), gain)
end

function FilterBiquad:delete()
    DestroyBiquadFilterNode(self.node)
    self.node = nil
end

FilterWaveShaper = {}

local function GetDistortionCurve(amount)
    local curve = {}

    local deg = math.pi / 180

    for i = 1, 44100 do
        local x = (i - 1) * 2 / 44100 - 1;
        curve[i] = (3 + amount) * x * 20 * deg / (math.pi + amount * math.abs(x));
    end

    local d = msgpack.pack(curve)
    return string.pack("<T", #d) .. d
end

function FilterWaveShaper:new(audioContext, curve)
    self.__index = self

    local node = AudiocontextCreateWaveshapernode(audioContext)
    WaveshapernodeSetCurve(node, GetDistortionCurve(curve))

    return setmetatable({audioContext = audioContext, node = node}, self)
end

function FilterWaveShaper:getNode()
    return self.node
end

function FilterWaveShaper:setCurve(curve)
    WaveshapernodeSetCurve(self.node, GetDistortionCurve(curve))
end

function FilterWaveShaper:delete()
    DestroyWaveShaperNode(self.node)
    self.node = nil
end

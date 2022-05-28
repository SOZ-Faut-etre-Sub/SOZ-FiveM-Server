ModuleProximityGrid = {}

local function GridToChannel(vectors)
    return (vectors.x << 8) | vectors.y
end

local function GetGridChunk(coords)
    return math.floor((coords + 8192) / GridSize)
end

local function GetGridChannel(coords, intact)
    local grid = vector2(GetGridChunk(coords.x), GetGridChunk(coords.y))
    local channel = GridToChannel(grid)

    if not intact and PlayerData.CurrentInstance ~= 0 then
        channel = tonumber(("%s0%s"):format(channel, PlayerData.CurrentInstance))
    end

    return channel
end

local function GetTargetChannels(coords, edge)
    local targets = {}

    for _, delta in ipairs(deltas) do
        local vectors = vector2(coords.x + delta.x * edge, coords.y + delta.y * edge)
        local channel = GetGridChannel(vectors)

        if not table.exist(targets, channel) then
            table.insert(targets, channel)
        end
    end

    return targets
end

local function IsArrayDifferent(current, old)
    if #current ~= #old then
        return true
    else
        for i = 1, #current, 1 do
            if current[i] ~= old[i] then
                return true
            end
        end
    end
end

function ModuleProximityGrid:new(target, range, edgeSize)
    self.__index = self
    return setmetatable({target = target, range = range, edgeSize = edgeSize, listeningGrids = {}, speakingGrid = 0}, self)
end

function ModuleProximityGrid:init()
    self.serverId = GetPlayerServerId(PlayerPedId())
    MumbleSetAudioInputDistance(self.range)

    Citizen.CreateThread(function()
        while true do
            local idle = 100

            local coords = GetEntityCoords(PlayerPedId())
            local currentGrid = GetGridChannel(coords)
            local edgeGrids = GetTargetChannels(coords, self.edgeSize)

            if IsArrayDifferent(edgeGrids, self.edgeGrids) then
                self.edgeGrids = edgeGrids
            end

            if currentGrid ~= self.speakingGrid then
                self.speakingGrid = currentGrid
            end

            Citizen.Wait(idle)
        end
    end)
end

function ModuleProximityGrid:updateRange(range)
    self.range = range
    MumbleSetAudioInputDistance(self.range)
end

function ModuleProximityGrid:refresh()
    local coords = GetEntityCoords(PlayerPedId())
    local currentGrid = GetGridChannel(coords)
    local edgeGrids = GetTargetChannels(coords, self.edgeSize)

    if IsArrayDifferent(edgeGrids, self.edgeGrids) then
        self.edgeGrids = edgeGrids
    end

    if currentGrid ~= self.speakingGrid then
        self.speakingGrid = currentGrid
    end

    while MumbleGetVoiceChannelFromServerId(self.serverId) ~= self.speakingGrid do
        NetworkSetVoiceChannel(self.speakingGrid)
        Citizen.Wait(0)
    end

    -- Listen to grid
    for _, gridId in self.listeningGrids do
        AddChannelToTargetList(self.target, gridId)
    end
end

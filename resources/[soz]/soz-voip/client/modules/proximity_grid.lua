ModuleProximityGrid = {}

local deltas = {
    vector2(-1, -1),
    vector2(-1, 0),
    vector2(-1, 1),
    vector2(0, -1),
    vector2(1, -1),
    vector2(1, 0),
    vector2(1, 1),
    vector2(0, 1),
}

local function GridToChannel(vectors)
    return (vectors.x << 8) | vectors.y
end

local function GetGridChunk(coords, gridSize)
    return math.floor((coords + 8192) / gridSize)
end

local function GetGridChannel(coords, gridSize)
    local grid = vector2(GetGridChunk(coords.x, gridSize), GetGridChunk(coords.y, gridSize))

    return GridToChannel(grid)
end

local function GetTargetChannels(coords, edge, gridSize)
    local targets = {}

    for _, delta in ipairs(deltas) do
        local vectors = vector2(coords.x + delta.x * edge, coords.y + delta.y * edge)
        local channel = GetGridChannel(vectors, gridSize)

        table.insert(targets, channel)
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

function ModuleProximityGrid:new(range, gridSize, edgeSize)
    self.__index = self
    return setmetatable({range = range, gridSize = gridSize, edgeSize = edgeSize, listeningGrids = {}, speakingGrid = 0}, self)
end

function ModuleProximityGrid:init()
    self.serverId = GetPlayerServerId(PlayerId())
    MumbleSetTalkerProximity(self.range)
end

function ModuleProximityGrid:updateRange(range)
    self.range = range
    MumbleSetTalkerProximity(self.range)
end

function ModuleProximityGrid:getSpeakers()
    return {}
end

function ModuleProximityGrid:getChannels()
    local channels = {self.speakingGrid}

    for _, channelId in pairs(self.listeningGrids) do
        table.insert(channels, channelId)
    end

    return channels
end

function ModuleProximityGrid:refresh()
    local coords = GetEntityCoords(PlayerPedId())
    local currentGrid = GetGridChannel(coords, self.gridSize)
    local edgeGrids = GetTargetChannels(coords, self.edgeSize, self.gridSize)

    if IsArrayDifferent(edgeGrids, self.listeningGrids) then
        self.listeningGrids = edgeGrids
    end

    if currentGrid ~= self.speakingGrid then
        self.speakingGrid = currentGrid
    end

    MumbleSetTalkerProximity(self.range)

    while MumbleGetVoiceChannelFromServerId(self.serverId) ~= self.speakingGrid do
        NetworkSetVoiceChannel(self.speakingGrid)
        Citizen.Wait(0)
    end
end

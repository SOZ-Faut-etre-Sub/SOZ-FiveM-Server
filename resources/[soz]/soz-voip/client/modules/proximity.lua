local GridSize, EdgeSize = Config.gridSize, Config.gridEdge

local CurrentGrids, PreviousGrid = {}, 0

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

function GridToChannel(vectors)
    return (vectors.x << 8) | vectors.y
end

function GetGridChunk(coords)
    return math.floor((coords + 8192) / GridSize)
end

function GetGridChannel(coords, intact)
    local grid = vector2(GetGridChunk(coords.x), GetGridChunk(coords.y))
    local channel = GridToChannel(grid)

    if not intact and PlayerData.CurrentInstance ~= 0 then
        channel = tonumber(("%s0%s"):format(channel, PlayerData.CurrentInstance))
    end

    return channel
end

function GetTargetChannels(coords, edge)
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

function SetGridChannels(current, previous)
    local toRemove = {}

    for _, grid in ipairs(previous) do
        if not table.exist(current, grid) then
            toRemove[#toRemove + 1] = grid
        end
    end

    AddChannelGroupToTargetList(current, "proximity")
    RemoveChannelGroupFromTargetList(toRemove, "proximity")

    CurrentGrids = current
end

function SetVoiceChannel(channelID)
    NetworkSetVoiceChannel(channelID)
    console.debug("[Main] Current Channel: %s", channelID)
    PlayerData.CurrentVoiceChannel = channelID
end

--- Private functions
local function MutePlayer(state)
    if state and type(state) == "boolean" then
        PlayerData.Muted = state
    else
        PlayerData.Muted = not PlayerData.Muted
    end
    TriggerServerEvent("voip:server:player:mute", PlayerData.Muted)

    if not PlayerData.Muted then
        SetVoiceProximity(PlayerData.CurrentProximity)
    else
        TriggerEvent("hud:client:UpdateVoiceMode", -1)
    end
    console.debug("Muted: " .. tostring(PlayerData.Muted))
end

local function ProximityVoiceIncrease()
    local newProximity = PlayerData.CurrentProximity + 1
    local proximity = condition.ternary(Config.voiceRanges[newProximity] ~= nil, newProximity, PlayerData.CurrentProximity)

    SetVoiceProximity(proximity)
end

local function ProximityVoiceDecrease()
    local newProximity = PlayerData.CurrentProximity - 1
    local proximity = condition.ternary(Config.voiceRanges[newProximity] ~= nil, newProximity, PlayerData.CurrentProximity)

    SetVoiceProximity(proximity)
end

--- Public functions
function SetVoiceProximity(proximity)
    local voiceProximity = Config.voiceRanges[proximity]

    MumbleSetAudioInputDistance(voiceProximity.range)
    PlayerData.CurrentProximity = proximity
    TriggerEvent("hud:client:UpdateVoiceMode", PlayerData.CurrentProximity - 1)

    console.debug("Set voice proximity range to %s (%s)", voiceProximity.name, voiceProximity.range)
end

function RegisterProximityModule()
    console.debug("Proximity module registering...")

    RegisterModuleContext("proximity", 0)

    Citizen.CreateThread(function()
        while true do
            local idle = 100

            local currentGrid = GetGridChannel(PlayerData.PlayerCoords)
            local edgeGrids = GetTargetChannels(PlayerData.PlayerCoords, EdgeSize)

            if IsDifferent(edgeGrids, CurrentGrids) then
                SetGridChannels(edgeGrids, CurrentGrids)
                console.debug("Grid changed: %s", table.concat(edgeGrids, ", "))
            end

            if currentGrid ~= PreviousGrid then
                SetVoiceChannel(currentGrid)
            end

            PreviousGrid = currentGrid

            Citizen.Wait(idle)
        end
    end)

    --- Keybindings
    RegisterCommand("voip-voice_up", ProximityVoiceIncrease, false)
    RegisterKeyMapping("voip-voice_up", "Parler plus fort", "keyboard", Config.rangeIncreaseHotkey)

    RegisterCommand("voip-voice_down", ProximityVoiceDecrease, false)
    RegisterKeyMapping("voip-voice_down", "Parler moins fort", "keyboard", Config.rangeDecreaseHotkey)

    RegisterCommand("voip-voice_mute", MutePlayer, false)
    RegisterKeyMapping("voip-voice_mute", "Ne plus parler", "keyboard", Config.muteHotkey)

    exports("MutePlayer", MutePlayer)

    console.debug("Proximity module registered !")
end

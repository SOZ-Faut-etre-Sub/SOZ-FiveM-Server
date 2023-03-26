local voiceTarget = 1

-- Call module
CallModuleInstance = ModuleCall:new(Config.volumeCall)

-- Radio modules
PrimaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-sr", "PrimaryShort", Config.balanceRadioPrimaryShort)
PrimaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-lr", "PrimaryLong", Config.balanceRadioPrimaryLong)
SecondaryShortRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-sr", "SecondaryShort", Config.balanceRadioSecondaryShort)
SecondaryLongRadioModuleInstance = ModuleRadio:new(Config.radioShortRangeDistance, "radio-lr", "SecondaryLong", Config.balanceRadioSecondaryLong)

-- Car module
CarModuleInstance = ModuleCar:new(Config.volumeVehicle)

-- Proximity modules
ProximityModuleCullingInstance = ModuleProximityCulling:new(Config.normalRange)
ProximityModuleGridInstance = ModuleProximityGrid:new(Config.normalRange, Config.gridSize, Config.gridEdge)
ProximityModuleInstance = ProximityModuleCullingInstance

-- Filter module
local FilterRegistryInstance = FilterSubmixRegistry:new()

local function updateSpeakers(speakers, newSpeakers, context, volume)
    for id, config in pairs(newSpeakers) do
        if speakers[id] and config.transmitting then
            speakers[id].serverId = config.serverId
            speakers[id].volume = volume
            speakers[id].distance = config.distance or speakers[id].distance
            speakers[id].distanceMax = config.distanceMax or speakers[id].distanceMax
            speakers[id].balanceLeft = config.balanceLeft or speakers[id].balanceLeft
            speakers[id].balanceRight = config.balanceRight or speakers[id].balanceRight
            speakers[id].transmitting = config.transmitting or false
            speakers[id].kind = config.kind or speakers[id].kind or ""

            table.insert(speakers[id].context, context)
        elseif not speakers[id] then
            speakers[id] = {
                serverId = config.serverId,
                volume = volume,
                distance = config.distance or 0,
                distanceMax = config.distanceMax or 0,
                balanceLeft = (config.balanceLeft or 1.0),
                balanceRight = (config.balanceRight or 1.0),
                context = {context},
                transmitting = config.transmitting,
                kind = config.kind or "",
            }

            if not config.transmitting then
                speakers[id].volume = -1.0
            end
        end
    end

    return speakers
end

local function contains(table, value)
    for _, val in pairs(table) do
        if val == value then
            return true
        end
    end

    return false
end

local LastVolumesSet = {}

local function RefreshState(state)
    -- clear everything
    MumbleSetVoiceTarget(voiceTarget)
    MumbleClearVoiceTarget(voiceTarget)

    -- readd channel
    for _, channelId in pairs(state.channels) do
        MumbleAddVoiceTargetChannel(voiceTarget, channelId)
    end

    -- readd players
    for id, config in pairs(state.players) do
        MumbleAddVoiceTargetPlayerByServerId(voiceTarget, config.serverId)

        if not LastVolumesSet[id] or LastVolumesSet[id].volume ~= config.volume then
            MumbleSetVolumeOverrideByServerId(config.serverId, config.volume)
            LastVolumesSet[id] = {serverId = config.serverId, volume = config.volume}
        end
    end

    for id, config in pairs(LastVolumesSet) do
        if not state.players[id] then
            MumbleSetVolumeOverrideByServerId(config.serverId, -1.0)
            LastVolumesSet[id] = nil
        end
    end

    return state
end
local lastState = {}
local restarting = false

RegisterCommand("voip-show-state", function()
    for _, channelId in pairs(lastState.channels) do
        print("Listen to channel: " .. channelId)
    end

    -- readd players
    for _, config in pairs(lastState.players) do
        print("Listen to player: " .. config.serverId .. ", volume: " .. config.volume)
    end
end, false)

local function GetFilterForPlayer(player)
    if contains(player.context, "call") then
        return "phone"
    end

    if contains(player.context, "radio_lr_primary") then
        return "radio"
    end

    if contains(player.context, "radio_lr_secondary") then
        return "radio"
    end

    if contains(player.context, "radio_sr_primary") then
        return "radio"
    end

    if contains(player.context, "radio_sr_secondary") then
        return "radio"
    end

    if contains(player.context, "megaphone") then
        return "megaphone"
    end

    return nil;
end

local function ApplyFilters(players)
    local toRemove = {}

    FilterRegistryInstance:loop(function(id)
        if not players[id] or players[id].transmitting ~= true then
            table.insert(toRemove, id)
        end
    end)

    for _, toRemoveId in pairs(toRemove) do
        FilterRegistryInstance:removeById(toRemoveId)
    end

    for _, player in pairs(players) do
        if player.transmitting then
            local filterType = GetFilterForPlayer(player)
            if filterType == nil then
                FilterRegistryInstance:remove(player.serverId)
            else
                FilterRegistryInstance:apply(player.serverId, filterType, player)
            end
        end
    end
end

local serverAddress = GetConvar("soz_voip_mumble_address", "")
local serverPort = GetConvarInt("soz_voip_mumble_port", 64738)

Citizen.CreateThread(function()
    -- Sometimes people need to to restart voip as soon as they log in, so we force a reconnection on start
    MumbleSetActive(false)
    Citizen.Wait(1000)

    -- Clear state
    lastState = {}
    LastVolumesSet = {}

    -- Reconnect
    if serverAddress ~= "" then
        MumbleSetServerAddress(serverAddress, serverPort)
    end

    MumbleSetActive(true)
    Citizen.Wait(1000)

    -- Init modules
    CarModuleInstance:init()
    ProximityModuleInstance:init()
    PrimaryShortRadioModuleInstance:init()
    PrimaryLongRadioModuleInstance:init()
    SecondaryShortRadioModuleInstance:init()
    SecondaryLongRadioModuleInstance:init()
    FilterRegistryInstance:init()

    MumbleSetVoiceTarget(voiceTarget)
    MumbleClearVoiceTarget(voiceTarget)

    while true do
        if not restarting then
            -- first refresh state of proximity
            ProximityModuleInstance:refresh()

            -- get all speakers and channels
            local state = {players = {}, channels = {}}

            state.channels = ProximityModuleInstance:getChannels()
            state.players = {}

            for _, data in pairs(ProximityModuleInstance:getSpeakers()) do
                state.players[("player_%d"):format(data.serverId)] = {
                    serverId = data.serverId,
                    volume = -1.0,
                    context = {data.context},
                    transmitting = data.transmitting,
                }
            end

            state.players = updateSpeakers(state.players, CarModuleInstance:getSpeakers(), "car", Config.volumeVehicle)
            state.players = updateSpeakers(state.players, SecondaryShortRadioModuleInstance:getSpeakers(), "radio_sr_secondary",
                                           Config.volumeRadioSecondaryShort)
            state.players = updateSpeakers(state.players, PrimaryShortRadioModuleInstance:getSpeakers(), "radio_sr_primary", Config.volumeRadioPrimaryShort)
            state.players = updateSpeakers(state.players, SecondaryLongRadioModuleInstance:getSpeakers(), "radio_lr_secondary", Config.volumeRadioSecondaryLong)
            state.players = updateSpeakers(state.players, PrimaryLongRadioModuleInstance:getSpeakers(), "radio_lr_primary", Config.volumeRadioPrimaryLong)
            state.players = updateSpeakers(state.players, CallModuleInstance:getSpeakers(), "call", Config.volumeCall)

            RefreshState(state)
            ApplyFilters(state.players)

            lastState = state
        end

        -- wait, do this every 200ms
        Citizen.Wait(200)
    end
end)

RegisterNetEvent("voip:client:reset", function()
    -- Shutdown voip state loop
    restarting = true
    Citizen.Wait(200)

    TriggerServerEvent("monitor:server:event", "voip_restart", {}, {}, true)

    exports["soz-hud"]:DrawNotification("Arret de la voip...", "info")

    -- Clear last state
    lastState = {}

    LocalPlayer.state:set("megaphone", false, true)

    -- Remove filters
    local toRemove = {}
    FilterRegistryInstance:loop(function(id)
        table.insert(toRemove, id)
    end)

    for _, toRemoveId in pairs(toRemove) do
        FilterRegistryInstance:removeById(toRemoveId)
    end

    -- Clear volume settings
    LastVolumesSet = {}

    -- Disable mumble
    MumbleSetActive(false)
    Citizen.Wait(1000)

    -- Reenable mumble
    MumbleSetActive(true)
    Citizen.Wait(1000)

    -- Allow voice loop to reinit state
    restarting = false
    exports["soz-hud"]:DrawNotification("Voip réactivée.", "info")
end)

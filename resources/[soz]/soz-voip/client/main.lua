PlayerData = {
    VoiceEnabled = false,
    PlayerPedId = PlayerPedId(),
    ServerId = GetPlayerServerId(PlayerId()),

    CurrentInstance = 0,

    Muted = false,
    CurrentTarget = 1,

    IsCalling = false,
    CurrentCall = nil,

    PlayerCoords = vector3(0.0, 0.0, 0.0),
    PlayerPreviousCoords = vector3(0.0, 0.0, 0.0),

    CurrentProximity = 2,
    CurrentVoiceChannel = 1,
}

Citizen.CreateThread(function()
    while true do
        local idle = 100

        PlayerData.PlayerPedId = PlayerPedId()
        PlayerData.PlayerCoords = GetEntityCoords(PlayerData.PlayerPedId)

        if PlayerData.PlayerCoords ~= PlayerData.PlayerPreviousCoords then
            idle = 50
        end

        if not PlayerData.VoiceEnabled then
            TriggerEvent("voip:client:state", true)
        end

        PlayerData.PlayerPreviousCoords = PlayerData.PlayerCoords

        Citizen.Wait(idle)
    end
end)

AddEventHandler("voip:client:state", function(state)
    PlayerData.VoiceEnabled = state

    TriggerServerEvent("voip:server:connection:state", state)

    if PlayerData.VoiceEnabled then
        while MumbleGetVoiceChannelFromServerId(PlayerData.ServerId) == 0 do
            NetworkSetVoiceChannel(PlayerData.CurrentVoiceChannel)
            Citizen.Wait(100)
        end

        RefreshTargets()
    end
end)

function RegisterModuleContext(context, priority)
    Transmissions:registerContext(context)
    Targets:registerContext(context)
    Channels:registerContext(context)
    Transmissions:setContextData(context, "priority", priority)

    console.debug("Context %s registered with priority %s", context, priority)
end

Citizen.CreateThread(function()
    for id, _ in pairs(Config.voiceTargets) do
        MumbleClearVoiceTarget(id)
        console.debug("Cleared voice target %s", id)
    end

    RegisterProximityModule()
    RegisterCallModule()
    RegisterRadioShortRangeModule()
    RegisterRadioLongRangeModule()

    SetVoiceProximity(PlayerData.CurrentProximity)
end)

function LoadAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        RequestAnimDict(dict)
        Citizen.Wait(0)
    end
end

--- Loop
Citizen.CreateThread(function()
    while true do
        RefreshTargets()

        Citizen.Wait(200)
    end
end)

--- Commands
RegisterCommand("voip-debug-mode", function(source, args, rawCommand)
    Config.debug = not Config.debug
    console.info("Debug mode : %s", Config.debug and "enabled" or "disabled")
end, false)

RegisterCommand("voip-debug-state", function(source, args, rawCommand)
    Channels:contextIterator(function(target, context)
        console.info("Channels %s (%s) : %s", context, target, Channels:targetHasAnyActiveContext(target) and "active" or "inactive")
    end)

    Targets:contextIterator(function(target, context)
        console.info("Targets %s (%s) : %s", context, target, Targets:targetHasAnyActiveContext(target) and "active" or "inactive")
    end)

    Transmissions:contextIterator(function(target, context)
        console.info("Transmissions %s (%s) : %s", context, target, Transmissions:targetHasAnyActiveContext(target) and "active" or "inactive")
    end)
end, false)

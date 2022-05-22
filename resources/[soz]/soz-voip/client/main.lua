PlayerData = {
    VoiceEnabled = false,
    PlayerPedId = PlayerPedId(),
    ServerId = GetPlayerServerId(PlayerId()),

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
            TriggerEvent('voip:client:state', true)
        end

        PlayerData.PlayerPreviousCoords = PlayerData.PlayerCoords

        Citizen.Wait(idle)
    end
end)

AddEventHandler('voip:client:state', function (state)
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

--- Variables
QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
voiceModule = {}

CurrentPlayer = {
    ServerId = GetPlayerServerId(PlayerId()),
    IsListenerEnabled = false,

    VoiceMode = 2,
    VoiceModeUpdateAllowed = true,
    VoiceModeProximityIsOverride = false,

    RadioButtonPressed = false,
    LastRadioButtonPressed = GetGameTimer(),
}

AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    PlayerData = {}
end)

---Events
AddEventHandler("onClientResourceStart", function(resource)
    if resource ~= GetCurrentResourceName() then
        return
    end

    TriggerEvent("hud:client:UpdateVoiceMode", CurrentPlayer.VoiceMode - 1)

    local state = LocalPlayer.state

    if state["radio-sr"] ~= nil and state["radio-sr"].primaryChannel ~= 0 then
        TriggerServerEvent("voip:server:setPlayerInChannel", "radio-sr", state["radio-sr"].primaryChannel, true)
    end

    if state["radio-sr"] ~= nil and state["radio-sr"].secondaryChannel ~= 0 then
        TriggerServerEvent("voip:server:setPlayerInChannel", "radio-sr", state["radio-sr"].secondaryChannel, false)
    end

    if state.call ~= nil and state.call.channel ~= nil then
        TriggerServerEvent("voip:server:setPlayerInChannel", "call", state.call.channel, false)
    end
end)

RegisterNetEvent("onPlayerJoining", function(serverId)
    if CurrentPlayer.IsListenerEnabled then
        MumbleAddVoiceChannelListen(serverId)
    end
end)

AddEventHandler("mumbleConnected", function()
    local voiceModeData = Config.VoiceModes[CurrentPlayer.VoiceMode]

    MumbleSetTalkerProximity(voiceModeData)
    MumbleClearVoiceTarget(Config.VoiceTarget)
    MumbleSetVoiceTarget(Config.VoiceTarget)
    MumbleSetVoiceChannel(CurrentPlayer.ServerId)

    while MumbleGetVoiceChannelFromServerId(CurrentPlayer.ServerId) ~= CurrentPlayer.ServerId do
        Wait(250)
    end

    MumbleAddVoiceTargetChannel(Config.VoiceTarget, CurrentPlayer.ServerId)

    addNearbyPlayers()
end)

RegisterNetEvent("onPlayerDropped", function(serverId)
    if CurrentPlayer.IsListenerEnabled then
        MumbleRemoveVoiceChannelListen(serverId)
    end
end)

CreateThread(function()
    local ScreenFaded = false
    while true do
        if not MumbleIsConnected() and (PlayerData.metadata ~= nil and not PlayerData.metadata["godmode"]) then
            if not ScreenFaded then
                TriggerScreenblurFadeIn(500)
                ScreenFaded = true
            end

            QBCore.Functions.DrawText(0.1, 0.45, 0.0, 0.0, 2.0, 193, 35, 35, 255, "Veuillez activer votre VoIP dans les paramètres")
        else
            if ScreenFaded then
                TriggerScreenblurFadeOut(500)
                ScreenFaded = false
            end

            Wait(10000)
        end

        Wait(0)
    end
end)

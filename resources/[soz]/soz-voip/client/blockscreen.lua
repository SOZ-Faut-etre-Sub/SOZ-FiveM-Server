--- Use local variables to avoid conflicts with main script
local QBCore = exports["qb-core"]:GetCoreObject()
local PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    PlayerData = {}
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

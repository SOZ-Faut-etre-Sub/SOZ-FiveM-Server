QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

Citizen.CreateThread(function()
    while true do
        InvalidateIdleCam()
        InvalidateVehicleIdleCam()
        Wait(1000)
    end
end)

local function CopyToClipboard(text)
    print("Copied to clipboard: " .. text)
    SendNUIMessage({string = text})
end
exports("CopyToClipboard", CopyToClipboard)

local QBCore = exports["qb-core"]:GetCoreObject()
local personalMenu = MenuV:CreateMenu("Menu personnel", "", 255, 0, 0, "default", "soz", "personal")
local PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

local function GenerateMenu()
    personalMenu:ClearItems()
    personalMenu:SetSubtitle(string.format("%s %s", PlayerData.charinfo.firstname, PlayerData.charinfo.lastname))

    HudToggleEntry(personalMenu)

    if personalMenu.IsOpen then
        personalMenu:Close()
    else
        personalMenu:Open()
    end
end

RegisterKeyMapping("personal", "Ouvrir le menu personnel", "keyboard", "F1")
RegisterCommand("personal", GenerateMenu, false)

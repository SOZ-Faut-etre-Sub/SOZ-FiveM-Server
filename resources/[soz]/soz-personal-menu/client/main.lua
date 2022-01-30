QBCore = exports["qb-core"]:GetCoreObject()
local personalMenu = MenuV:CreateMenu(nil, "", "menu_personal", "soz", "personal")
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

    InvoiceEntry(personalMenu)
    HudToggleEntry(personalMenu)

    if personalMenu.IsOpen then
        personalMenu:Close()
    else
        personalMenu:Open()
    end
end

RegisterKeyMapping("personal", "Ouvrir le menu personnel", "keyboard", "F1")
RegisterCommand("personal", GenerateMenu, false)

QBCore = exports["qb-core"]:GetCoreObject()
personalMenu = MenuV:CreateMenu(nil, "", "menu_personal", "soz", "personal")
PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

local function GenerateMenu()
    if PlayerData.metadata["isdead"] or PlayerData.metadata["inlaststand"] or PlayerData.metadata["ishandcuffed"] then
        return
    end

    personalMenu:ClearItems()
    personalMenu:SetSubtitle(string.format("%s %s", PlayerData.charinfo.firstname, PlayerData.charinfo.lastname))

    IdentityEntry(personalMenu)
    KeysEntry(personalMenu)
    TenueEntry(personalMenu)
    InvoiceEntry(personalMenu)
    AnimationsEntry()
    HudToggleEntry(personalMenu)
    JobEntry(personalMenu)
    HealthEntry(personalMenu)
    VoipEntry(personalMenu)

    if MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= personalMenu.UUID then
        MenuV:CloseAll(function()
            personalMenu:Open()
        end)
    else
        MenuV:CloseAll(function()
            personalMenu:Close()
        end)
    end
end

RegisterKeyMapping("personal", "Ouvrir le menu personnel", "keyboard", "F1")
RegisterCommand("personal", GenerateMenu, false)

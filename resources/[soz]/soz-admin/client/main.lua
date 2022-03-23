QBCore = exports["qb-core"]:GetCoreObject()

AdminMenu = MenuV:CreateMenu(nil, "", "menu_admin", "soz", "admin-panel")

local function OpenAdminMenu()
    if MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= AdminMenu.UUID then
        QBCore.Functions.TriggerCallback("admin:server:isAllowed", function(isAllowed)
            if isAllowed then
                AdminMenu:Open()
            end
        end)
    else
        AdminMenu:Close()
    end
end

RegisterKeyMapping("admin", "", "keyboard", "F9")
RegisterCommand("admin", OpenAdminMenu, false)

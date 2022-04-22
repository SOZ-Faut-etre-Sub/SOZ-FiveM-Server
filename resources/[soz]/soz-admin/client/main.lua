QBCore = exports["qb-core"]:GetCoreObject()

AdminMenu = MenuV:CreateMenu(nil, "", "menu_admin", "soz", "admin-panel")
MapperMenu = MenuV:CreateMenu(nil, "", "menu_mapper", "soz", "mapping-panel")

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

local function OpenMapperMenu()
    if MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= MapperMenu.UUID then
        QBCore.Functions.TriggerCallback("admin:server:isAllowed", function(isAllowed)
            if isAllowed then
                MapperMenu:Open()
            end
        end)
    else
        MapperMenu:Close()
    end
end

RegisterKeyMapping("admin", "AdminMenu", "keyboard", "F9")
RegisterCommand("admin", OpenAdminMenu, false)

RegisterKeyMapping("mapper", "MapperMenu", "keyboard", "F10")
RegisterCommand("mapper", OpenMapperMenu, false)

QBCore = exports["qb-core"]:GetCoreObject()

AdminMenu = MenuV:CreateMenu(nil, "", "menu_admin", "soz", "admin-panel")
MapperMenu = MenuV:CreateMenu(nil, "", "menu_mapper", "soz", "mapping-panel")

local function OpenAdminMenu()
    if MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= AdminMenu.UUID then
        QBCore.Functions.TriggerCallback("admin:server:isAllowed", function(isAllowed, permission)
            if isAllowed then
                AdminMenu:ClearItems()
                AdminMenu.Texture = "menu_admin_" .. permission

                AdminMenuGameMaster(AdminMenu, permission)
                AdminMenuDynamicMap(AdminMenu, permission)
                AdminMenuJob(AdminMenu, permission)
                AdminMenuSkin(AdminMenu, permission)
                AdminMenuVehicles(AdminMenu, permission)
                AdminMenuPlayers(AdminMenu, permission)
                AdminMenuDeveloper(AdminMenu, permission)

                MenuV:CloseAll(function()
                    AdminMenu:Open()
                end)
            end
        end)
    else
        MenuV:CloseAll(function()
            AdminMenu:Close()
        end)
    end
end

local function OpenMapperMenu()
    if MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= MapperMenu.UUID then
        QBCore.Functions.TriggerCallback("admin:server:isAllowed", function(isAllowed, permission)
            if isAllowed then
                MapperMenu:ClearItems()

                MapperMenuProps(MapperMenu)
                MapperMenuHousing(MapperMenu)
                MapperMenuMapper(MapperMenu)

                MenuV:CloseAll(function()
                    MapperMenu:Open()
                end)
            end
        end)
    else
        MenuV:CloseAll(function()
            MapperMenu:Close()
        end)
    end
end

RegisterKeyMapping("admin", "AdminMenu", "keyboard", "F9")
RegisterCommand("admin", OpenAdminMenu, false)

RegisterKeyMapping("mapper", "MapperMenu", "keyboard", "F10")
RegisterCommand("mapper", OpenMapperMenu, false)

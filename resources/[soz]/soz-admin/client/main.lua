QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

AdminMenu = MenuV:CreateMenu(nil, "", "menu_admin", "soz", "admin-panel")
MapperMenu = MenuV:CreateMenu(nil, "", "menu_mapper", "soz", "mapping-panel")

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

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

RegisterKeyMapping("mapper", "MapperMenu", "keyboard", "F10")
RegisterCommand("mapper", OpenMapperMenu, false)

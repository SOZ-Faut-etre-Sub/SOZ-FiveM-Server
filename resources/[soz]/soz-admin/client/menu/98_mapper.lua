local mapperMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "Menu pour les mappeurs"})

local MapperOption = {ShowInterior = false}

--- Functions
local function ToggleShowInteriorInfo()
    Citizen.CreateThread(function()
        while MapperOption.ShowInterior do
            local player = PlayerPedId()
            local interiorId = GetInteriorFromEntity(player)

            if interiorId ~= 0 then
                local roomHash = GetRoomKeyFromEntity(player)
                local roomId = GetInteriorRoomIndexByHash(interiorId, roomHash)
                local roomTimecycle = GetInteriorRoomTimecycle(interiorId, roomId)
                local portalCount = GetInteriorPortalCount(interiorId)
                local roomCount = GetInteriorRoomCount(interiorId)
                local roomFlag = GetInteriorRoomFlag(interiorId, roomId)
                local roomName = GetInteriorRoomName(interiorId, roomId)

                QBCore.Functions.DrawText(0.25, 0.01, 0.0, 0.0, 0.4, 66, 182, 245, 255, "~b~InteriorID: ~w~" .. interiorId)
                QBCore.Functions.DrawText(0.25, 0.03, 0.0, 0.0, 0.4, 66, 182, 245, 255, "~b~RoomID: ~w~" .. roomId)
                QBCore.Functions.DrawText(0.25, 0.05, 0.0, 0.0, 0.4, 66, 182, 245, 255, "~b~RoomCount: ~w~" .. roomCount - 1)
                QBCore.Functions.DrawText(0.25, 0.07, 0.0, 0.0, 0.4, 66, 182, 245, 255, "~b~RoomTimecycle: ~w~" .. roomTimecycle)
                QBCore.Functions.DrawText(0.25, 0.09, 0.0, 0.0, 0.4, 66, 182, 245, 255, "~b~PortalCount: ~w~" .. portalCount)
                QBCore.Functions.DrawText(0.25, 0.11, 0.0, 0.0, 0.4, 66, 182, 245, 255, "~b~RoomFlag: ~w~" .. roomFlag)
                QBCore.Functions.DrawText(0.25, 0.13, 0.0, 0.0, 0.4, 66, 182, 245, 255, "~b~RoomName: ~w~" .. roomName)
            end

            Citizen.Wait(0)
        end
    end)
end

--- Menu entries
mapperMenu:AddCheckbox({
    label = "Afficher les informations de l'intérieur",
    value = MapperOption.ShowInterior,
    change = function()
        MapperOption.ShowInterior = not MapperOption.ShowInterior
        ToggleShowInteriorInfo()
    end,
})

--- Add to main menu
AdminMenu:AddButton({icon = "🚧", label = "Outils pour mappeur", value = mapperMenu})

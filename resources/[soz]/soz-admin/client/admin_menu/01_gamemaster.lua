local gameMasterMenu, GameMasterOption = nil, {Invisible = false}

--- Functions
local moneyGiveItem = {
    {label = "$1000", value = 1000},
    {label = "$5000", value = 5000},
    {label = "$10000", value = 10000},
    {label = "$100000", value = 100000},
}

local licences = {
    {label = "Voiture", value = "car"},
    {label = "Poids lourd", value = "truck"},
    {label = "Moto", value = "motorcycle"},
    {label = "Hélicoptère", value = "heli"},
    {label = "Bateau", value = "boat"},
}

function AdminMenuGameMaster(menu, permission)
    if gameMasterMenu == nil then
        gameMasterMenu = MenuV:InheritMenu(menu, {subtitle = "Dieu ? c'est toi ?"})
    end

    gameMasterMenu:ClearItems()

    gameMasterMenu:AddSlider({
        label = "Se donner de l'argent propre",
        value = "money",
        values = moneyGiveItem,
        select = function(_, value)
            TriggerServerEvent("admin:gamemaster:giveMoney", "money", value)
        end,
        disabled = permission ~= "admin",
    })

    gameMasterMenu:AddSlider({
        label = "Se donner de l'argent marqué",
        value = "marked_money",
        values = moneyGiveItem,
        select = function(_, value)
            TriggerServerEvent("admin:gamemaster:giveMoney", "marked_money", value)
        end,
        disabled = permission ~= "admin",
    })

    gameMasterMenu:AddButton({
        label = "Se téléporter au marqueur",
        value = nil,
        select = function()
            local player = PlayerPedId()
            local WaypointHandle = GetFirstBlipInfoId(8)

            if DoesBlipExist(WaypointHandle) then
                local waypointCoords = GetBlipInfoIdCoord(WaypointHandle)

                SetPedCoordsKeepVehicle(player, waypointCoords.x, waypointCoords.y, waypointCoords.z)
                for height = waypointCoords.z, 1000 do
                    local found, z = GetGroundZFor_3dCoord_2(waypointCoords.x, waypointCoords.y, height + 0.0)

                    if found then
                        SetPedCoordsKeepVehicle(player, waypointCoords.x, waypointCoords.y, z)
                        break
                    end

                    Wait(0)
                end
            end
        end,
    })

    gameMasterMenu:AddSlider({
        label = "Se donner le permis",
        values = licences,
        select = function(_, value)
            TriggerServerEvent("admin:gamemaster:giveLicence", value)
        end,
        disabled = permission ~= "admin",
    })

    gameMasterMenu:AddCheckbox({
        label = "Mallette d'argent",
        value = true,
        change = function(_, checked)
            LocalPlayer.state.adminDisableMoneyCase = not checked
        end,
        disabled = permission ~= "admin",
    })

    gameMasterMenu:AddCheckbox({
        label = "Invisible",
        value = GameMasterOption.Invisible,
        change = function(_, checked)
            SetEntityVisible(PlayerPedId(), not checked, 0)
        end,
        disabled = permission ~= "admin",
    })

    gameMasterMenu:AddCheckbox({
        label = "Invincible",
        value = nil,
        change = function(_, checked)
            SetPlayerInvincible(PlayerId(), checked)
        end,
        disabled = permission ~= "admin",
    })

    gameMasterMenu:AddButton({
        label = "Auto-pilote",
        value = nil,
        select = function()
            local player = PlayerPedId()
            local vehicle = GetVehiclePedIsIn(player, false)
            local WaypointHandle = GetFirstBlipInfoId(8)

            if DoesBlipExist(WaypointHandle) then
                local waypointCoords = GetBlipInfoIdCoord(WaypointHandle)

                TaskVehicleDriveToCoordLongrange(player, vehicle, waypointCoords.x, waypointCoords.y, waypointCoords.z, 60.0, 262539, 20.0)
            else
                exports["soz-hud"]:DrawNotification("Vous n'avez pas sélectionné de destination", "error")
            end
        end,
    })

    gameMasterMenu:AddCheckbox({
        label = "God mode",
        value = nil,
        change = function(_, checked)
            TriggerServerEvent("admin:gamemaster:godmode", checked)
            TriggerEvent("lsmc:maladie:ClearDisease")
        end,
        disabled = permission ~= "admin",
    })

    gameMasterMenu:AddButton({
        label = "Se libérer des menottes",
        value = nil,
        select = function()
            TriggerServerEvent("admin:gamemaster:unCuff")
        end,
    })

    --- Add to main menu
    menu:AddButton({icon = "🎲", label = "Menu du maître du jeu", value = gameMasterMenu})
end

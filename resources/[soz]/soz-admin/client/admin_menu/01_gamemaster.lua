local gameMasterMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "Dieu ? c'est toi ?"})

local GameMasterOption = {Invisible = false}

--- Functions
local moneyGiveItem = {
    {label = "$1000", value = 1000},
    {label = "$5000", value = 5000},
    {label = "$10000", value = 10000},
    {label = "$100000", value = 100000},
}

--- Menu entries
gameMasterMenu:AddSlider({
    label = "Se donner de l'argent propre",
    value = "money",
    values = moneyGiveItem,
    select = function(_, value)
        TriggerServerEvent("admin:gamemaster:giveMoney", "money", value)
    end,
})

gameMasterMenu:AddSlider({
    label = "Se donner de l'argent sale",
    value = "marked_money",
    values = moneyGiveItem,
    select = function(_, value)
        TriggerServerEvent("admin:gamemaster:giveMoney", "marked_money", value)
    end,
})

gameMasterMenu:AddButton({
    label = "Se téléporter au marquer",
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

gameMasterMenu:AddCheckbox({
    label = "En service",
    value = nil,
    change = function(_, checked)
        TriggerServerEvent("QBCore:ToggleDuty")
    end,
})

gameMasterMenu:AddCheckbox({
    label = "Mallette d'argent",
    value = true,
    change = function(_, checked)
        LocalPlayer.state.adminDisableMoneyCase = not checked
    end,
})

gameMasterMenu:AddCheckbox({
    label = "Invisible",
    value = nil,
    change = function(_, checked)
        SetEntityVisible(PlayerPedId(), not checked, 0)
    end,
})

gameMasterMenu:AddCheckbox({
    label = "Invincible",
    value = nil,
    change = function(_, checked)
        SetPlayerInvincible(PlayerId(), checked)
    end,
})

gameMasterMenu:AddCheckbox({
    label = "God mode",
    value = nil,
    change = function(_, checked)
        TriggerServerEvent("admin:gamemaster:godmode", checked)
        TriggerEvent("lsmc:maladie:ClearDisease")
    end,
})

gameMasterMenu:AddButton({
    label = "Se libérer des menottes",
    value = nil,
    select = function()
        TriggerServerEvent("admin:gamemaster:unCuff")
    end,
})

--- Add to main menu
AdminMenu:AddButton({icon = "🎲", label = "Menu du maître du jeu", value = gameMasterMenu})

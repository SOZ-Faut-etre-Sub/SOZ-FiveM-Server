local developerMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "Menu pour les développeurs"})

local DeveloperOption = {ShowCoords = false, NoClip = false, ActivateDisease = false}

--- Functions
local function ToggleShowCoordinates()
    Citizen.CreateThread(function()
        while DeveloperOption.ShowCoords do
            local coords = GetEntityCoords(PlayerPedId())
            local heading = GetEntityHeading(PlayerPedId())

            local x = QBCore.Shared.Round(coords.x, 2)
            local y = QBCore.Shared.Round(coords.y, 2)
            local z = QBCore.Shared.Round(coords.z, 2)
            local w = QBCore.Shared.Round(heading, 2)

            QBCore.Functions.DrawText(0.4, 0.01, 0.0, 0.0, 0.4, 66, 182, 245, 255,
                                      string.format("~w~Ped Coordinates:~b~ vector4(~w~%s~b~, ~w~%s~b~, ~w~%s~b~, ~w~%s~b~)", x, y, z, w))

            Citizen.Wait(0)
        end
    end)
end

local function CopyToClipboard(dataType)
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)

    local x = QBCore.Shared.Round(coords.x, 2)
    local y = QBCore.Shared.Round(coords.y, 2)
    local z = QBCore.Shared.Round(coords.z, 2)
    local w = QBCore.Shared.Round(heading, 2)

    if dataType == "coords3" then
        SendNUIMessage({string = string.format("vector3(%s, %s, %s)", x, y, z)})
    elseif dataType == "coords4" then
        SendNUIMessage({string = string.format("vector4(%s, %s, %s, %s)", x, y, z, w)})
    end
end

--- Menu entries
developerMenu:AddCheckbox({
    label = "Noclip",
    value = DeveloperOption.NoClip,
    description = "Se déplacer en noclip",
    change = function(_, checked)
        DeveloperOption.NoClip = checked
        ToggleNoClipMode()
    end,
})

developerMenu:AddCheckbox({
    label = "Afficher les coordonnées",
    value = DeveloperOption.ShowCoords,
    change = function()
        DeveloperOption.ShowCoords = not DeveloperOption.ShowCoords
        ToggleShowCoordinates()
    end,
})

developerMenu:AddCheckbox({
    label = "Désactiver les maladies",
    value = DeveloperOption.ActivateDisease,
    change = function()
        TriggerEvent("lsmc:maladie:ActivateDisease", DeveloperOption.ActivateDisease)
        DeveloperOption.ActivateDisease = not DeveloperOption.ActivateDisease
    end,
})

developerMenu:AddSlider({
    label = "Copier les coords",
    value = "coords",
    values = {{label = "vector4", value = "coords4"}, {label = "vector3", value = "coords3"}},
    select = function(_, value)
        CopyToClipboard(value)
    end,
})

developerMenu:AddButton({
    label = "Redonner la faim/soif",
    value = nil,
    select = function()
        TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + 100)
        TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] + 100)
    end,
})

--- Add to main menu
AdminMenu:AddButton({icon = "🛠", label = "Outils pour développeur", value = developerMenu})

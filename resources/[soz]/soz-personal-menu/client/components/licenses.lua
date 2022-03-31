local isShowingAround = false
local showingTo = {}

local function UpdateLicenseMenu(identitySubmenu, showingAround)
    isShowingAround = showingAround
    identitySubmenu:Close()
    identitySubmenu:ClearItems()
    GenerateLicenseMenu(identitySubmenu, isShowingAround)
    identitySubmenu:Open()
end

function GenerateLicenseMenu(identitySubmenu, showingAround)
    local sliders = {
        {label = "Ma carte d'identité", event = "soz-identity:client:request-identity-data"},
        {label = "Mes permis", event = "soz-identity:client:request-licenses-data"},
    }

    local description = nil
    local hideLabel = "Masquer les papiers"
    if showingAround then
        description = "Vous montrez vos papiers aux personnes alentours"
        hideLabel = "Arrêter de montrer vos papiers"
    end

    -- SLIDERS (identity + licenses)
    for _, data in ipairs(sliders) do
        local slider = identitySubmenu:AddSlider({
            label = data.label,
            description = description,
            values = {{label = "Voir", value = "see"}, {label = "Montrer", value = "show"}},
        })

        slider:On("select", function(_, value)
            if value == "see" then
                TriggerEvent(data.event, QBCore.Functions.GetPlayerData().source, value)

            elseif value == "show" then
                local coords = GetEntityCoords(PlayerPedId())
                local closePlayers = QBCore.Functions.GetPlayersFromCoords(coords, 4.0)

                if type(closePlayers) == "table" and #closePlayers > 1 then
                    UpdateLicenseMenu(identitySubmenu, true)
                    for _, player in ipairs(closePlayers) do
                        local pid = GetPlayerServerId(player)
                        table.insert(showingTo, pid)
                        TriggerEvent(data.event, GetPlayerServerId(player), value)
                    end
                else
                    exports["soz-hud"]:DrawNotification("~r~Il n'y a personne à proximité", false, 3000)
                    return
                end
            end
        end)
    end

    --- HIDE BUTTON
    local hideButton = identitySubmenu:AddButton({label = hideLabel, description = description, value = "hide"})

    hideButton:On("select", function()
        TriggerEvent("soz-identity:client:hide")
        if showingAround then
            TriggerServerEvent("soz-identity:server:hide-around", showingTo)
            UpdateLicenseMenu(identitySubmenu, false)
            showingTo = {}
        end
    end)
end

function LicensesEntry(menu)
    local identitySubmenu = MenuV:InheritMenu(menu, {subtitle = "Gestion de l'identité"})

    menu:AddButton({
        label = "Mon identité",
        value = identitySubmenu,
        description = "Voir/Montrer vos papiers d'identité",
    })

    GenerateLicenseMenu(identitySubmenu, isShowingAround)
end

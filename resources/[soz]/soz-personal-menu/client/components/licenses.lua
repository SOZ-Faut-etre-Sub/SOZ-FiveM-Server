function LicensesEntry(menu)
    local identitySubmenu = MenuV:InheritMenu(menu, {subtitle="Gestion de l'identité"})

    menu:AddButton({label = "Mon identité", value = identitySubmenu, description = "Voir/Montrer vos papiers d'identité"})

    local sliders = {
        {label = "Ma carte d'identité", description = "Voir/Montrer vos papiers d'identité", event = "soz-identity:client:request-identity-data"},
        {label = "Mes permis", description = "Voir/Montrer vos permis", event = "soz-identity:client:request-licenses-data"},
    }

    -- SLIDERS (identity + licenses)
    for _, data in ipairs(sliders) do
        local slider = identitySubmenu:AddSlider({
            label = data.label,
            discription = data.description,
            values = {
                {label = "Voir", value = "see"},
                {label = "Montrer", value = "show"},
            },
        })

        slider:On("select", function (_, value)
            local target
            if value == "see" then
                target = QBCore.Functions.GetPlayerData().source

            elseif value == "show" then
                local closestPlayer, distance = QBCore.Functions.GetClosestPlayer()
                if closestPlayer ~= -1 and distance < 2.0 then
                    target = GetPlayerServerId(closestPlayer)
                else
                    exports["soz-hud"]:DrawNotification("~r~Il n'y a personne à proximité", false, 3000)
                    return
                end
            end

            -- Request data to server and display NUI
            TriggerEvent(data.event, target)
        end)
    end

    --- HIDE BUTTON
    local hideButton = identitySubmenu:AddButton({label = "Masquer les papiers", value = "hide", description = "Masquer carte d'identité ou permis"})

    hideButton:On("select", function ()
        TriggerEvent("soz-identity:client:hide")
    end)
end

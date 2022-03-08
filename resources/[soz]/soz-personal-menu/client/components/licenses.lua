function LicensesEntry(menu)
    local licensesSlider = menu:AddSlider({
        label = "Mes permis",
        description = "Voir/Montrer vos permis",
        values = {
            {label = "Voir", value = "see"},
            {label = "Montrer", value = "show"},
            {label = "Masquer", value = "hide"},
        },
    })

    licensesSlider:On("select", function(_, value)
        if value == "hide" then
            TriggerEvent("soz-identity:client:hide-license")
            return
        end

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
        TriggerEvent("soz-identity:client:request-licenses-data", target)
    end)
end

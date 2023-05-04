RegisterNetEvent("housing:client:PlayerRequestEnter", function(propertyId, apartmentId, target)
    CreateThread(function()
        local notificationTimer = GetGameTimer() + 20000
        exports["soz-core"]:DrawNotification("Une personne souhaite entrer dans votre appartement.~n~Faites ~g~Y~s~ pour l'accepter ou ~r~N~s~ pour la refuser",
                                             "info", 20000)

        while notificationTimer > GetGameTimer() do
            DisableControlAction(0, 246, true)
            DisableControlAction(0, 249, true)

            if IsDisabledControlJustReleased(0, 246) then
                TriggerServerEvent("housing:server:SetPlayerInApartment", propertyId, apartmentId, target)
                exports["soz-core"]:DrawNotification("Vous avez accepté la personne.")
                return
            end

            if IsDisabledControlJustReleased(0, 249) then
                exports["soz-core"]:DrawNotification("Vous avez refusé la personne.")
                return
            end

            Wait(0)
        end
    end)
end)

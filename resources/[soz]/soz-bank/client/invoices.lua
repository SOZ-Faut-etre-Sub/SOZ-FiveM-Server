RegisterNetEvent("banking:client:invoiceReceived", function(invoiceId, label, amount)
    CreateThread(function()
        local notificationTimer = GetGameTimer() + 20000
        exports["soz-hud"]:DrawAdvancedNotification("Maze Facture", "Facture de ~r~$" .. amount,
                                                    ("Raison : %s~n~~n~Faites ~g~Y~s~ pour accepter la facture ou ~r~N~s~ pour la refuser"):format(label),
                                                    "CHAR_BANK_MAZE", "info", 20000)

        while notificationTimer > GetGameTimer() do
            DisableControlAction(0, 246, true)
            DisableControlAction(0, 249, true)

            if IsDisabledControlJustReleased(0, 246) then
                TriggerServerEvent("banking:server:payInvoice", invoiceId)
                return
            end

            if IsDisabledControlJustReleased(0, 249) then
                TriggerServerEvent("banking:server:rejectInvoice", invoiceId)
                return
            end

            Wait(0)
        end
    end)
end)

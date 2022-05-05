function InvoiceEntry(menu)
    local invoiceMenu = MenuV:InheritMenu(menu, {subtitle = "Gestion des factures"})
    menu:AddButton({label = "Gestion des factures", value = invoiceMenu, description = "Payez vos factures"})

    QBCore.Functions.TriggerCallback("banking:server:getInvoices", function(invoices)
        if invoices then
            for id, invoice in pairs(invoices) do
                invoiceMenu:AddConfirm({
                    label = invoice.title,
                    description = ("Payer ~r~%s$~s~ pour ~b~%s"):format(invoice.amount, invoice.emitterName),
                    value = "n",
                    confirm = function()
                        TriggerServerEvent("banking:server:payInvoice", id)
                        invoiceMenu:Close()
                        menu:Close()
                    end,
                    deny = function()
                        TriggerServerEvent("banking:server:rejectInvoice", id)
                        invoiceMenu:Close()
                        menu:Close()
                    end,
                })
            end
        end
    end)
end

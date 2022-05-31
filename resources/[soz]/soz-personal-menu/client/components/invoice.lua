function InvoiceEntry(menu)
    local invoiceMenu = MenuV:InheritMenu(menu, {subtitle = "Gestion des factures"})

    invoiceMenu:On("open", function(m)
        QBCore.Functions.TriggerCallback("banking:server:getInvoices", function(invoices)
            for id, invoice in pairs(invoices) do
                m:AddConfirm({
                    label = invoice.label,
                    description = ("Payer ~r~%s$~s~ pour ~b~%s"):format(invoice.amount, invoice.emitterName),
                    value = "n",
                    confirm = function()
                        TriggerServerEvent("banking:server:payInvoice", id)
                        m:Close()
                        menu:Close()
                    end,
                    deny = function()
                        TriggerServerEvent("banking:server:rejectInvoice", id)
                        m:Close()
                        menu:Close()
                    end,
                })
            end
        end)
    end)

    invoiceMenu:On("close", function(m)
        m:ClearItems()
    end)

    menu:AddButton({label = "Gestion des factures", value = invoiceMenu, description = "Payez vos factures"})
end

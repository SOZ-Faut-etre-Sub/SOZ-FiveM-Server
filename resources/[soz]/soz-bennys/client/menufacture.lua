QBCore = exports["qb-core"]:GetCoreObject()

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facturer",
                color = "bennys",
                icon = "c:jobs/facture.png",
                event = "jobs:client:InvoicePlayer",
                job = "bennys",
            },
            {
                label = "Facturer la société",
                color = "bennys",
                icon = "c:jobs/facture.png",
                event = "jobs:client:InvoiceSociety",
                canInteract = function()
                    return SozJobCore.Functions.HasPermission("bennys", SozJobCore.JobPermission.SocietyBankInvoices)
                end,
                job = "bennys",
            },
        },
        distance = 2.5,
    })
end)

QBCore = exports["qb-core"]:GetCoreObject()

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facture",
                color = "bennys",
                icon = "fas fa-file-invoice-dollar",
                job = "bennys",
                action = function(entity)
                    local title = exports["soz-hud"]:Input("Titre", 200)
                    if title == nil or title == "" then
                        exports["soz-hud"]:DrawNotification("Vous devez spécifier un title", "error")
                        return
                    end

                    local amount = exports["soz-hud"]:Input("Montant", 10)
                    if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
                        exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
                        return
                    end

                    TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)), title, amount)
                end,
                canInteract = function(entity)
                    return OnDuty and not IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
                end,
            },
        },
        distance = 2.5,
    })
end)

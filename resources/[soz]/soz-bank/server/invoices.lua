local PlayersInvoices = {}

MySQL.ready(function()
    MySQL.query("SELECT * FROM invoices WHERE payed = false AND refused = false", {}, function(result)
        if result then
            for _, invoice in pairs(result) do
                if PlayersInvoices[invoice.citizenid] == nil then
                    PlayersInvoices[invoice.citizenid] = {}
                end

                PlayersInvoices[invoice.citizenid][invoice.id] = {
                    emitterName = invoice.emitterName,
                    title = invoice.label,
                    amount = invoice.amount,
                }
            end
        end
    end)
end)

QBCore.Functions.CreateCallback("banking:server:getInvoices", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        cb(PlayersInvoices[Player.PlayerData.citizenid])
    else
        cb(nil)
    end
end)

local function PayInvoice(citizenid, invoiceID)
    local invoice = MySQL.single.await("SELECT * FROM invoices WHERE citizenid = ? AND id = ? AND payed = false AND refused = false", {
        citizenid,
        invoiceID,
    })
    if invoice then
        local Player = QBCore.Functions.GetPlayerByCitizenId(invoice.citizenid)

        MySQL.Async.execute("UPDATE invoices SET payed = true WHERE citizenid = ? AND id = ? AND payed = false AND refused = false",
                            {invoice.citizenid, invoice.id}, function(affectedRows)
            if affectedRows then
                if Player.Functions.RemoveMoney("money", invoice.amount) then
                    local Emitter = QBCore.Functions.GetPlayerByCitizenId(invoice.emitter)
                    Account.AddMoney(invoice.emitterSafe, invoice.amount)

                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~payé~s~ votre facture")
                    TriggerClientEvent("hud:client:DrawNotification", Emitter.PlayerData.source,
                                       ("Votre facture ~b~%s~s~ a été ~g~payée"):format(invoice.label))
                end

                PlayersInvoices[citizenid][invoiceID] = nil
            end
        end)
    end
end

local function RejectInvoice(citizenid, invoiceID)
    local invoice = MySQL.single.await("SELECT * FROM invoices WHERE citizenid = ? AND id = ? AND payed = false AND refused = false", {
        citizenid,
        invoiceID,
    })
    if invoice then
        local Player = QBCore.Functions.GetPlayerByCitizenId(invoice.citizenid)

        MySQL.Async.execute("UPDATE invoices SET refused = true WHERE citizenid = ? AND id = ? AND payed = false AND refused = false",
                            {invoice.citizenid, invoice.id}, function(affectedRows)
            if affectedRows then
                local Emitter = QBCore.Functions.GetPlayerByCitizenId(invoice.emitter)

                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~r~refusé~s~ votre facture")
                TriggerClientEvent("hud:client:DrawNotification", Emitter.PlayerData.source,
                                   ("Votre facture ~b~%s~s~ a été ~r~refusée"):format(invoice.label))

                PlayersInvoices[citizenid][invoiceID] = nil
            end
        end)
    end
end

--- TriggerServerEvent("banking:server:sendInvoice", 5, "Title for invoice", 500)
RegisterNetEvent("banking:server:sendInvoice", function(target, label, amount, kind)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(target)

    if amount ~= nil and tonumber(amount) > 0 then
        if Player and Target and Player ~= Target then
            local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))
            if dist > 5 then
                return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Personne n'est à portée de vous", "error")
            end

            local id = MySQL.insert.await("INSERT INTO invoices (citizenid,emitter,emitterName,emitterSafe,label,amount) VALUES (?,?,?,?,?,?) ", {
                Target.PlayerData.citizenid,
                Player.PlayerData.citizenid,
                SozJobCore.Jobs[Player.PlayerData.job.id].label,
                "safe_" .. Player.PlayerData.job.id,
                label,
                tonumber(amount),
            })

            if PlayersInvoices[Target.PlayerData.citizenid] == nil then
                PlayersInvoices[Target.PlayerData.citizenid] = {}
            end

            PlayersInvoices[Target.PlayerData.citizenid][id] = {
                emitterName = SozJobCore.Jobs[Player.PlayerData.job.id].label,
                title = label,
                amount = tonumber(amount),
            }

            TriggerEvent("monitor:server:event", "invoice_emit", {
                player_source = Player.PlayerData.source,
                invoice_kind = kind or "invoice",
            }, {
                target_source = Target.PlayerData.source,
                position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
                title = label,
                id = id,
                amount = tonumber(amount),
            })

            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre facture a bien été émise")
            TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, "Vous venez de recevoir une facture", "info")
        end
    end
end)

RegisterNetEvent("banking:server:payInvoice", function(invoiceID)
    local Player = QBCore.Functions.GetPlayer(source)
    local CurrentMoney = Player.Functions.GetMoney("money")

    if PlayersInvoices[Player.PlayerData.citizenid] then
        local invoice = PlayersInvoices[Player.PlayerData.citizenid][invoiceID]

        if invoice then
            if invoice.amount <= CurrentMoney then
                PayInvoice(Player.PlayerData.citizenid, invoiceID)
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
            end
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de facture a payer", "info")
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de facture a payer", "info")
    end
end)

RegisterNetEvent("banking:server:rejectInvoice", function(invoiceID)
    local Player = QBCore.Functions.GetPlayer(source)

    if PlayersInvoices[Player.PlayerData.citizenid] then
        local invoice = PlayersInvoices[Player.PlayerData.citizenid][invoiceID]

        if invoice then
            RejectInvoice(Player.PlayerData.citizenid, invoiceID)
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de facture a payer", "info")
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de facture a payer", "info")
    end
end)

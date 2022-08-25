local Invoices = {}

--- Functions
local function PlayerHaveAccessToInvoices(PlayerData, account)
    if PlayerData.charinfo.account == account then
        return true
    end

    return SozJobCore.Functions.HasPermission(account, PlayerData.job.id, PlayerData.job.grade, SozJobCore.JobPermission.SocietyBankInvoices)
end

local function GetAllInvoices(PlayerData)
    local invoices = {}

    for account, data in pairs(Invoices) do
        if PlayerHaveAccessToInvoices(PlayerData, account) then
            for id, invoice in pairs(data) do
                invoices[id] = invoice
            end
        end
    end

    return invoices
end

local function PayInvoice(PlayerData, account, id)
    if not PlayerHaveAccessToInvoices(PlayerData, account) then
        return false
    end

    if not Invoices[account] then
        return false
    end

    if not Invoices[account][id] then
        return false
    end

    local invoice = Invoices[account][id]
    local Player = QBCore.Functions.GetPlayerByCitizenId(invoice.citizenid)
    local Emitter = QBCore.Functions.GetPlayerByCitizenId(invoice.emitter)

    if PlayerData.charinfo.account == account then
        if Player.Functions.RemoveMoney("money", invoice.amount) then
            Account.AddMoney(invoice.emitterSafe, invoice.amount)

            MySQL.update.await("UPDATE invoices SET payed = true WHERE id = ? AND payed = false AND refused = false", {
                invoice.id,
            })

            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~payé~s~ votre facture")
            if Emitter then
                TriggerClientEvent("hud:client:DrawNotification", Emitter.PlayerData.source, ("Votre facture ~b~%s~s~ a été ~g~payée"):format(invoice.label))
            end

            TriggerEvent("monitor:server:event", "invoice_pay", {
                player_source = Player.PlayerData.source,
                invoice_kind = "invoice",
                invoice_job = "",
            }, {
                target_source = Emitter and Emitter.PlayerData.source or nil,
                id = id,
                amount = tonumber(invoice.amount),
                target_account = invoice.emitterSafe,
                source_account = invoice.targetAccount,
            })

            Invoices[account][id] = nil
            return true
        end

        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
        return false
    else
        Account.TransfertMoney(invoice.targetAccount, invoice.emitterSafe, invoice.amount, function(success, reason)
            if success then
                MySQL.update.await("UPDATE invoices SET payed = true WHERE id = ? AND payed = false AND refused = false", {
                    invoice.id,
                })

                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~payé~s~ la facture de la société")
                if Emitter then
                    TriggerClientEvent("hud:client:DrawNotification", Emitter.PlayerData.source,
                                       ("Votre facture ~b~%s~s~ a été ~g~payée"):format(invoice.label))
                end

                TriggerEvent("monitor:server:event", "invoice_pay",
                             {
                    player_source = Player.PlayerData.source,
                    invoice_kind = "invoice",
                    invoice_job = Player.PlayerData.job.id,
                }, {
                    target_source = Emitter and Emitter.PlayerData.source or nil,
                    id = id,
                    amount = tonumber(invoice.amount),
                    target_account = invoice.emitterSafe,
                    source_account = invoice.targetAccount,
                })

                Invoices[account][id] = nil
            end

            return success
        end)
    end

    return true
end

local function RejectInvoice(PlayerData, account, id)
    if not PlayerHaveAccessToInvoices(PlayerData, account) then
        return false
    end

    if not Invoices[account] then
        return false
    end

    if not Invoices[account][id] then
        return false
    end

    local invoice = Invoices[account][id]
    local Player = QBCore.Functions.GetPlayerByCitizenId(invoice.citizenid)
    local Emitter = QBCore.Functions.GetPlayerByCitizenId(invoice.emitter)

    if PlayerData.charinfo.account == account then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~r~refusé~s~ votre facture")

        if Emitter then
            TriggerClientEvent("hud:client:DrawNotification", Emitter.PlayerData.source, ("Votre facture ~b~%s~s~ a été ~r~refusée"):format(invoice.label))
        end

        TriggerEvent("monitor:server:event", "invoice_refuse", {
            player_source = Player.PlayerData.source,
            invoice_kind = "invoice",
            invoice_job = "",
        }, {
            target_source = Emitter and Emitter.PlayerData.source or nil,
            id = id,
            amount = tonumber(invoice.amount),
            target_account = invoice.emitterSafe,
            source_account = invoice.targetAccount,
            title = invoice.label,
        })
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~r~refusé~s~ la facture de la société", "error")

        if Emitter then
            TriggerClientEvent("hud:client:DrawNotification", Emitter.PlayerData.source, ("Votre facture ~b~%s~s~ a été ~r~refusée"):format(invoice.label))
        end

        TriggerEvent("monitor:server:event", "invoice_refuse",
                     {
            player_source = Player.PlayerData.source,
            invoice_kind = "invoice",
            invoice_job = Player.PlayerData.job.id,
        }, {
            target_source = Emitter and Emitter.PlayerData.source or nil,
            id = id,
            amount = tonumber(invoice.amount),
            target_account = invoice.emitterSafe,
            source_account = invoice.targetAccount,
            title = invoice.label,
        })
    end

    MySQL.update.await("UPDATE invoices SET refused = true WHERE id = ? AND payed = false AND refused = false", {
        invoice.id,
    })
    Invoices[account][id] = nil

    return true
end

local function CreateInvoice(Emitter, Target, account, targetAccount, label, amount, kind)
    local dist = #(GetEntityCoords(GetPlayerPed(Emitter.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))

    if dist > 5 then
        TriggerClientEvent("hud:client:DrawNotification", Emitter.PlayerData.source, "Personne n'est à portée de vous", "error")
        return false
    end

    local id = MySQL.insert.await(
                   "INSERT INTO invoices (citizenid, emitter, emitterName, emitterSafe, targetAccount, label, amount, kind) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", {
            Target.PlayerData.citizenid,
            Emitter.PlayerData.citizenid,
            SozJobCore.Jobs[Emitter.PlayerData.job.id].label,
            "safe_" .. Emitter.PlayerData.job.id,
            targetAccount,
            label,
            amount,
            kind or "invoice",
        })

    if id then
        if not Invoices[targetAccount] then
            Invoices[targetAccount] = {}
        end

        Invoices[targetAccount][id] = {
            id = id,
            citizenid = Target.PlayerData.citizenid,
            emitter = Emitter.PlayerData.citizenid,
            emitterName = SozJobCore.Jobs[Emitter.PlayerData.job.id].label,
            emitterSafe = "safe_" .. Emitter.PlayerData.job.id,
            targetAccount = targetAccount,
            label = label,
            amount = amount,
        }

        TriggerClientEvent("banking:client:invoiceReceived", Target.PlayerData.source, id, label, amount)

        local invoiceJob = ""

        if targetAccount ~= Target.PlayerData.charinfo.account then
            invoiceJob = Target.PlayerData.job.id
        end

        TriggerEvent("monitor:server:event", "invoice_emit",
                     {
            player_source = Emitter.PlayerData.source,
            invoice_kind = kind or "invoice",
            invoice_job = invoiceJob,
        }, {
            target_source = Target.PlayerData.source,
            position = GetEntityCoords(GetPlayerPed(Emitter.PlayerData.source)),
            title = label,
            id = id,
            amount = tonumber(amount),
            target_account = targetAccount,
        })

        return true
    end

    return false
end

--- Events
MySQL.ready(function()
    MySQL.query("SELECT * FROM invoices WHERE payed = false AND refused = false", {}, function(result)
        if result then
            for _, invoice in pairs(result) do
                if invoice.targetAccount == nil then
                    goto skip
                end

                Invoices[invoice.targetAccount] = Invoices[invoice.targetAccount] or {}
                Invoices[invoice.targetAccount][invoice.id] = invoice

                ::skip::
            end
        end
    end)
end)

QBCore.Functions.CreateCallback("banking:server:getInvoices", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        cb(GetAllInvoices(Player.PlayerData))
    else
        cb({})
    end
end)

RegisterNetEvent("banking:server:sendInvoice", function(target, label, amount, kind)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(target)

    if amount == nil or tonumber(amount) <= 0 then
        return
    end

    if not Player or not Target or Player == Target then
        return
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "paper", 1) then
        if CreateInvoice(Player, Target, Player.PlayerData.job.id, Target.PlayerData.charinfo.account, label, tonumber(amount), kind) then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre facture a bien été émise")
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de papier", "error")
    end
end)

RegisterNetEvent("banking:server:sendSocietyInvoice", function(target, label, amount, kind)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(target)

    if amount == nil or tonumber(amount) <= 0 then
        return
    end

    if not Player or not Target or Player == Target then
        return
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "paper", 1) then
        if CreateInvoice(Player, Target, Player.PlayerData.job.id, Target.PlayerData.job.id, label, tonumber(amount), kind) then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre facture a bien été émise")
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de papier", "error")
    end
end)

RegisterNetEvent("banking:server:payInvoice", function(invoiceID)
    local Player = QBCore.Functions.GetPlayer(source)

    if not Player then
        return
    end

    for account, invoices in pairs(Invoices) do
        for id, _ in pairs(invoices) do
            if id == invoiceID then
                PayInvoice(Player.PlayerData, account, invoiceID)

                return
            end
        end
    end

    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de facture a payer", "info")
end)

RegisterNetEvent("banking:server:rejectInvoice", function(invoiceID)
    local Player = QBCore.Functions.GetPlayer(source)

    if not Player then
        return
    end

    for account, invoices in pairs(Invoices) do
        for id, _ in pairs(invoices) do
            if id == invoiceID then
                RejectInvoice(Player.PlayerData, account, invoiceID)

                return
            end
        end
    end

    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de facture a payer", "info")
end)

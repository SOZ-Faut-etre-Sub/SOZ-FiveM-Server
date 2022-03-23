local PlayersInvoices = {}

MySQL.ready(function()
    MySQL.query("SELECT * FROM invoices WHERE payed = false", {}, function(result)
        if result then
            for _, invoice in pairs(result) do
                if PlayersInvoices[invoice.citizenid] == nil then
                    PlayersInvoices[invoice.citizenid] = {}
                end

                PlayersInvoices[invoice.citizenid][invoice.id] = {
                    emitterAccount = invoice.emitter,
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
    local invoice = MySQL.single.await("SELECT * FROM invoices WHERE citizenid = ? AND id = ? AND payed = false", {
        citizenid,
        invoiceID,
    })
    if invoice then
        local Player = QBCore.Functions.GetPlayerByCitizenId(invoice.citizenid)

        MySQL.Async.execute("UPDATE invoices SET payed = true WHERE citizenid = ? AND id = ? AND payed = false", {
            invoice.citizenid,
            invoice.id,
        }, function(affectedRows)
            if affectedRows then
                if Player.Functions.RemoveMoney("money", invoice.amount) then
                    Account.AddMoney(invoice.emitter, invoice.amount)
                end

                PlayersInvoices[citizenid][invoiceID] = nil
            end
        end)
    end
end

--- TriggerServerEvent("banking:server:sendInvoice", 5, "Title for invoice", 500)
RegisterNetEvent("banking:server:sendInvoice", function(target, label, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(target)

    if amount ~= nil and tonumber(amount) > 0 then
        if Player and Target and Player ~= Target then
            local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))
            if dist > 5 then
                return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Personne n'est à portée de vous")
            end

            local id = MySQL.insert.await("INSERT INTO invoices (citizenid,emitter,emitterName,label,amount) VALUES (?,?,?,?,?) ", {
                Target.PlayerData.citizenid,
                "safe_" .. Player.PlayerData.job.id,
                SozJobCore.Jobs[Player.PlayerData.job.id].label,
                label,
                tonumber(amount),
            })

            if PlayersInvoices[Target.PlayerData.citizenid] == nil then
                PlayersInvoices[Target.PlayerData.citizenid] = {}
            end

            PlayersInvoices[Target.PlayerData.citizenid][id] = {
                emitterAccount = Player.PlayerData.job.id,
                emitterName = SozJobCore.Jobs[Player.PlayerData.job.id].label,
                title = label,
                amount = tonumber(amount),
            }
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

                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~g~Vous avez payé votre facture")
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous n'avez pas assez d'argent")
            end
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous n'avez pas de facture a payer")
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous n'avez pas de facture a payer")
    end
end)

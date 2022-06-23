QBCore.Functions.CreateCallback("soz-upw:server:ResaleEnergy", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    local item = QBCore.Shared.Items[Config.Items.Energy]
    if not item then
        cb({false, "invalid item"})
        return
    end

    local count = exports["soz-inventory"]:GetItem(Player.PlayerData.source, item.name, nil, true)
    if count == 0 then
        cb({false, string.format("Vous n'avez pas l'item requis")})
        return
    end

    local invChanged = exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1)
    if not invChanged then
        cb({false, "Vous n'avez rien vendu..."})
        return
    end

    TriggerEvent("banking:server:TransferMoney", Config.Upw.Accounts.FarmAccount, Config.Upw.Accounts.SafeAccount, Config.Upw.Resale.EnergyCellPrice)

    cb({true, "Vous avez vendu ~g~1 " .. item.label})
end)

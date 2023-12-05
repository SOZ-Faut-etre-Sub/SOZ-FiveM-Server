QBCore.Functions.CreateCallback("soz-upw:server:ResaleEnergy", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    for _, energyItem in pairs(Config.Items.Energy) do
        local item = QBCore.Shared.Items[energyItem]
        if not item then
            cb({false, "invalid item"})
            return
        end

        local count = exports["soz-inventory"]:GetItem(Player.PlayerData.source, item.name, nil, true)
        if count == 0 then
            goto continue
        end

        if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1) then
            TriggerEvent("banking:server:TransferMoney", Config.Upw.Accounts.FarmAccount, Config.Upw.Accounts.SafeAccount,
                         Config.Upw.Resale.EnergyCellPrice[item.name] or 0)

            TriggerEvent("soz-core:server:monitor:add-event", "job_upw_energy_resale", {
                item_id = item.name,
                player_citizen_id = Player.PlayerData.citizenid,
            }, {item_label = item.label, quantity = 1, resale_price = Config.Upw.Resale.EnergyCellPrice[item.name] or 0}, true)

            cb({true, "Vous avez vendu ~g~1 " .. item.label})
            return
        else
            cb({false, "Vous n'avez rien vendu..."})
            return
        end

        ::continue::
    end

    cb({false, string.format("Vous n'avez pas l'item requis")})
end)

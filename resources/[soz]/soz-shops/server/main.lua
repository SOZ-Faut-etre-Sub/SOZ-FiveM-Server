local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("shops:server:pay", function(shop, itemId, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount)

    if Config.Locations[shop] == nil or Config.Locations[shop].products[itemId] == nil then
        return
    end

    if Player then
        local item = Config.Locations[shop].products[itemId]
        local price = item.price * amount

        if item.amount < amount then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Ce magasin n'a pas assez de stock")
            return
        end

        if Player.Functions.RemoveMoney("money", price) then
            exports["soz-inventory"]:AddItem(Player.PlayerData.source, item.name, amount, nil, nil, function(success, reason)
                if success then
                    Config.Locations[shop].products[itemId].amount = Config.Locations[shop].products[itemId].amount - amount
                    if Config.Locations[shop].products[itemId].amount <= 0 then
                        Config.Locations[shop].products[itemId].amount = 0
                    end
                    TriggerClientEvent("shops:client:SetShopItems", -1, shop, Config.Locations[shop].products)

                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                       ("Vous venez d'acheter ~b~%s %s~s~ pour ~g~$%s"):format(amount, QBCore.Shared.Items[item.name].label, price))
                end
            end)
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~~r~Vous n'avez pas assez d'argent")
        end
    end
end)

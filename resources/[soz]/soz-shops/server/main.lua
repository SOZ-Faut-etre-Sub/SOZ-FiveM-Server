local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("shops:server:pay", function(shop, product, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount) or 1

    if Config.Locations[shop] == nil or (Config.Locations[shop].type ~= "tattoo" and Config.Locations[shop].products[product] == nil) then
        return
    end

    if Player then
        local item = Config.Locations[shop].products[product]
        if Config.Locations[shop].type == "tattoo" then
            for _, tattoo in pairs(Config.Locations[shop].products) do
                local overlayField = Player.PlayerData.charinfo.gender == 0 and "HashNameMale" or "HashNameFemale"

                if tattoo["Collection"] == product.collection and tattoo[overlayField] == product.overlay then
                    item = {price = tattoo["Price"]}
                    break
                end
            end
        end
        local price = item.price * amount

        if Config.Locations[shop].type ~= "tattoo" and item.amount < amount then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Ce magasin n'a pas assez de stock", "error")
            return
        end

        if Player.Functions.RemoveMoney("money", price) then
            if Config.Locations[shop].type ~= "tattoo" then
                exports["soz-inventory"]:AddItem(Player.PlayerData.source, item.name, amount, nil, nil, function(success, reason)
                    if success then
                        Config.Locations[shop].products[product].amount = Config.Locations[shop].products[product].amount - amount
                        if Config.Locations[shop].products[product].amount <= 0 then
                            Config.Locations[shop].products[product].amount = 0
                        end
                        TriggerClientEvent("shops:client:SetShopItems", -1, shop, Config.Locations[shop].products)

                        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                           ("Vous venez d'acheter ~b~%s %s~s~ pour ~g~$%s"):format(amount, QBCore.Shared.Items[item.name].label, price))
                    end
                end)
            else
                local skin = Player.PlayerData.skin
                skin.Tattoos = skin.Tattoos or {}

                table.insert(skin.Tattoos, {
                    Collection = GetHashKey(product.collection),
                    Overlay = GetHashKey(product.overlay),
                })

                Player.Functions.SetSkin(skin)

                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous venez de vous faire tatouer pour ~g~$%s"):format(price))
            end
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
        end
    end
end)

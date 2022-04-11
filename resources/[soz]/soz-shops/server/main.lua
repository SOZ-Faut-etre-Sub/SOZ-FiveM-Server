local QBCore = exports["qb-core"]:GetCoreObject()

--- Items functions
local function getItemPrice(product, productID, Player)
    if product == "tattoo" then
        for _, tattoo in pairs(Config.Products[product]) do
            local overlayField = Player.PlayerData.charinfo.gender == 0 and "HashNameMale" or "HashNameFemale"

            if tattoo["Collection"] == productID.collection and tattoo[overlayField] == productID.overlay then
                return tattoo["Price"]
            end
        end
    elseif product == "barber" or product == "jewelry" then
        return Config.Products[product][Player.PlayerData.skin.Model.Hash][productID.category].price
    elseif product == "ponsonbys" or product == "suburban" or product == "binco" then
        return Config.Products[product][Player.PlayerData.skin.Model.Hash][productID.category].Collections[productID.collection].Price
    else
        return Config.Products[product][productID].price
    end
end

RegisterNetEvent("shops:server:pay", function(product, productID, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount) or 1

    if Config.Products[product] == nil then
        return
    end

    if Player then
        local item = Config.Products[product][productID]
        local price = getItemPrice(product, productID, Player) * amount

        if product ~= "tattoo" and product ~= "barber" and product ~= "jewelry" and product ~= "ponsonbys" and product ~= "suburban" and product ~= "binco" and
            item.amount < amount then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Ce magasin n'a pas assez de stock", "error")
            return
        end

        if Player.Functions.RemoveMoney("money", price) then
            if product == "tattoo" then
                local skin = Player.PlayerData.skin
                skin.Tattoos = skin.Tattoos or {}

                table.insert(skin.Tattoos, {
                    Collection = GetHashKey(productID.collection),
                    Overlay = GetHashKey(productID.overlay),
                })

                Player.Functions.SetSkin(skin)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous venez de vous faire tatouer pour ~g~$%s"):format(price))
            elseif product == "barber" then
                local barberShop = Config.Products[product][Player.PlayerData.skin.Model.Hash][productID.category]
                local skin = Player.PlayerData.skin

                for componentID, component in pairs(productID.data) do
                    if barberShop.components[componentID] then
                        skin[productID.overlay][componentID] = component
                    end
                end

                Player.Functions.SetSkin(skin)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez changé de coupe pour ~g~$%s"):format(price))
            elseif product == "jewelry" then
                local skin = Player.PlayerData.skin

                skin[productID.overlay] = {}
                skin[productID.overlay].Drawable = tonumber(productID.component)
                skin[productID.overlay].Texture = tonumber(productID.drawable)

                Player.Functions.SetSkin(skin)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez acheté un bijou pour ~g~$%s"):format(price))
            elseif product == "ponsonbys" or product == "suburban" or product == "binco" then
                local clothConfig = Player.PlayerData.cloth_config
                local clothItem =
                    Config.Products[product][Player.PlayerData.skin.Model.Hash][productID.category].Collections[productID.collection].Items[productID.item]

                for componentId, component in pairs(clothItem.Components or {}) do
                    clothConfig["BaseClothSet"].Components[tonumber(componentId)] = {}
                    clothConfig["BaseClothSet"].Components[tonumber(componentId)].Drawable = tonumber(component.Drawable)
                    clothConfig["BaseClothSet"].Components[tonumber(componentId)].Texture = tonumber(component.Texture)
                    clothConfig["BaseClothSet"].Components[tonumber(componentId)].Palette = tonumber(component.Palette)
                end

                Player.Functions.SetClothConfig(clothConfig, true)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez acheté de tenue pour ~g~$%s"):format(price))
            else
                exports["soz-inventory"]:AddItem(Player.PlayerData.source, item.name, amount, nil, nil, function(success, reason)
                    if success then
                        Config.Products[product][productID].amount = Config.Products[product][productID].amount - amount
                        if Config.Products[product][productID].amount <= 0 then
                            Config.Products[product][productID].amount = 0
                        end
                        TriggerClientEvent("shops:client:SetShopItems", -1, product, Config.Products[product])

                        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                           ("Vous venez d'acheter ~b~%s %s~s~ pour ~g~$%s"):format(amount, QBCore.Shared.Items[item.name].label, price))
                    end
                end)
            end
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
        end
    end
end)

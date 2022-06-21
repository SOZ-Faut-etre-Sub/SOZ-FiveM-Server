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

local function shouldCheckAmount(brand)
    return brand ~= "tattoo" and brand ~= "barber" and brand ~= "jewelry" and brand ~= "ponsonbys" and brand ~= "suburban" and brand ~= "binco"
end

RegisterNetEvent("shops:server:pay", function(brand, productID, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount) or 1

    if Config.Products[brand] == nil then
        return
    end

    if Player then
        local item = Config.Products[brand][productID]
        local price = getItemPrice(brand, productID, Player) * amount

        if brand ~= "tattoo" and brand ~= "barber" and brand ~= "jewelry" and brand ~= "ponsonbys" and brand ~= "suburban" and brand ~= "binco" and item.amount <
            amount then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Ce magasin n'a pas assez de stock", "error")
            return
        end

        if shouldCheckAmount(brand) then
            local qbItem = QBCore.Shared.Items[item.name]
            local canCarryItem = exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, qbItem, amount)

            if not canCarryItem then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas porter cette quantité...", "error")
                return
            end
        end

        if Player.Functions.RemoveMoney("money", price) then
            if brand == "tattoo" then
                local skin = Player.PlayerData.skin
                skin.Tattoos = skin.Tattoos or {}

                skin.Tattoos[#skin.Tattoos + 1] = {
                    Collection = GetHashKey(productID.collection),
                    Overlay = GetHashKey(productID.overlay),
                }

                Player.Functions.SetSkin(skin, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous venez de vous faire tatouer pour ~g~$%s"):format(price))
            elseif brand == "barber" then
                local barberShop = Config.Products[brand][Player.PlayerData.skin.Model.Hash][productID.category]
                local skin = Player.PlayerData.skin

                for componentID, component in pairs(productID.data) do
                    if barberShop.components[componentID] then
                        skin[productID.overlay][componentID] = component
                    end
                end

                Player.Functions.SetSkin(skin, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez changé de coupe pour ~g~$%s"):format(price))
            elseif brand == "jewelry" then
                local clothConfig = Player.PlayerData.cloth_config

                clothConfig["BaseClothSet"].Props[tostring(productID.category)] = {
                    Drawable = tonumber(productID.component),
                    Texture = tonumber(productID.drawable),
                }

                Player.Functions.SetClothConfig(clothConfig, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez acheté un bijou pour ~g~$%s"):format(price))
            elseif brand == "ponsonbys" or brand == "suburban" or brand == "binco" then
                local clothConfig = Player.PlayerData.cloth_config
                local clothItem =
                    Config.Products[brand][Player.PlayerData.skin.Model.Hash][productID.category].Collections[productID.collection].Items[productID.item]

                for componentId, component in pairs(clothItem.ApplyComponents or {}) do
                    clothConfig["BaseClothSet"].Components[tostring(componentId)] = {}
                    clothConfig["BaseClothSet"].Components[tostring(componentId)].Drawable = tonumber(component.Drawable)
                    clothConfig["BaseClothSet"].Components[tostring(componentId)].Texture = tonumber(component.Texture) or 0
                    clothConfig["BaseClothSet"].Components[tostring(componentId)].Palette = tonumber(component.Palette) or 0
                end

                if productID.torso and productID.torso.drawable and productID.torso.texture then
                    clothConfig["BaseClothSet"].Components["3"] = {
                        Drawable = tonumber(productID.torso.drawable),
                        Texture = tonumber(productID.torso.texture),
                        Palette = 0,
                    }
                end

                Player.Functions.SetClothConfig(clothConfig, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez acheté un habit pour ~g~$%s"):format(price))
            else
                exports["soz-inventory"]:AddItem(Player.PlayerData.source, item.name, amount, nil, nil, function(success, reason)
                    if success then
                        Config.Products[brand][productID].amount = Config.Products[brand][productID].amount - amount
                        if Config.Products[brand][productID].amount <= 0 then
                            Config.Products[brand][productID].amount = 0
                        end
                        TriggerClientEvent("shops:client:SetShopItems", -1, brand, Config.Products[brand])

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

RegisterNetEvent("shops:server:resetTattoos", function()
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        local skin = Player.PlayerData.skin
        skin.Tattoos = {}

        Player.Functions.SetSkin(skin, false)
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous venez de vous faire retirer tous vos tatouages")
    end
end)

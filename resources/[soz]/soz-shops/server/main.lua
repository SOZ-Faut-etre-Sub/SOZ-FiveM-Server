local QBCore = exports["qb-core"]:GetCoreObject()

local ShopsPed = {}
local Shops = {}
local ShopsContent = {
    [1885233650] = {}, -- Homme
    [-1667301416] = {}, -- Femme
}

-- Create the shop
MySQL.ready(function()
    local shops = MySQL.query.await(
                      "select shop.id as shop_id, shop.name as shop_name, category.id as category_id, category.parent_id as category_parent_id, category.name as category_name from shop_categories inner join shop on shop_categories.shop_id = shop.id inner join category on shop_categories.category_id = category.id or shop_categories.category_id = category.parent_id")

    for _, shop in pairs(ShopsContent) do
        for _, v in pairs(shops or {}) do
            Shops[v.shop_name] = v.shop_id

            if shop[v.shop_id] == nil then
                shop[v.shop_id] = {name = v.shop_name, items = {}}
            end

            if v.category_parent_id then
                if shop[v.shop_id].items[v.category_parent_id] == nil then
                    shop[v.shop_id].items[v.category_parent_id] = {name = v.category_name, items = {}}
                end

                shop[v.shop_id].items[v.category_parent_id].items[v.category_id] = {name = v.category_name, items = {}}
            else
                if shop[v.shop_id].items[v.category_id] == nil then
                    shop[v.shop_id].items[v.category_id] = {name = v.category_name, items = {}}
                end
            end
        end
    end

    local clothes = MySQL.query.await(
                        "select shop_content.*, category.id as category_id, category.parent_id as category_parent_id from shop_content inner join category on shop_content.category_id = category.id or shop_content.category_id = category.parent_id where shop_id IN (1, 2, 3)")
    for _, v in pairs(clothes or {}) do
        local data = json.decode(v.data)

        if v.category_parent_id then
            ShopsContent[tonumber(data.modelHash)][v.shop_id].items[v.category_parent_id].items[v.category_id].items[v.id] = {
                label = v.label,
                price = v.price,
                data = data,
                stock = v.stock,
            }
        else
            ShopsContent[tonumber(data.modelHash)][v.shop_id].items[v.category_id].items[v.id] = {
                label = v.label,
                price = v.price,
                data = data,
                stock = v.stock,
            }
        end
    end
end)

-- GetShopContent
QBCore.Functions.CreateCallback("shops:server:GetShopContent", function(source, cb, shop_name)
    local Player = QBCore.Functions.GetPlayer(source)
    local PlayerModelHash = Player.PlayerData.skin.Model.Hash

    cb(ShopsContent[PlayerModelHash][Shops[shop_name]].items or {})
end)

--- Items functions

local function checkStock(products, productID, amount)
    if type(products) ~= "table" then
        return false, nil
    end

    for productId, product in pairs(products) do
        if productId == productID and product.stock then
            return (product.stock >= amount), product
        end
    end

    for _, product in pairs(products) do
        if product.items ~= nil then
            local stock, p = checkStock(product.items, productID, amount)
            if stock then
                return stock, p
            end
        end
    end

    if products.items ~= nil then
        for _, product in pairs(products.items) do
            local stock, p = checkStock(product.items, productID, amount)
            if stock then
                return stock, p
            end
        end
    end

    return false, nil
end

local function getItemPrice(brand, product, Player)
    if brand == "tattoo" then
        for _, tattoo in pairs(Config.Products[brand]) do
            local overlayField = Player.PlayerData.charinfo.gender == 0 and "HashNameMale" or "HashNameFemale"

            if tattoo["Collection"] == product.collection and tattoo[overlayField] == product.overlay then
                return tattoo["Price"]
            end
        end
    elseif brand == "barber" then
        return Config.Products[brand][Player.PlayerData.skin.Model.Hash][product.categoryIndex].price
    elseif brand == "jewelry" then
        return Config.Products[brand][Player.PlayerData.skin.Model.Hash][product.categoryIndex].price
    elseif brand == "ponsonbys" or brand == "suburban" or brand == "binco" then
        local _, item = checkStock(ShopsContent[Player.PlayerData.skin.Model.Hash][Shops[brand]], product.item, 1)
        if item then
            return item.price
        end
        return 1000000000 -- Safe guard, if no clothe was found
    else
        return Config.Products[brand][product].price
    end
end

local function shouldCheckAmount(brand)
    return brand ~= "tattoo" and brand ~= "barber" and brand ~= "jewelry" and brand ~= "ponsonbys" and brand ~= "suburban" and brand ~= "binco"
end

RegisterNetEvent("shops:server:pay", function(brand, product, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount) or 1

    if Config.Products[brand] == nil then
        return
    end

    if Player then
        local item = Config.Products[brand][product]
        local price = getItemPrice(brand, product, Player) * amount

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
                    Collection = GetHashKey(product.collection),
                    Overlay = GetHashKey(product.overlay),
                }

                Player.Functions.SetSkin(skin, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous venez de vous faire tatouer pour ~g~$%s"):format(price))
            elseif brand == "barber" then
                local barberShop = Config.Products[brand][Player.PlayerData.skin.Model.Hash][product.categoryIndex]
                local skin = Player.PlayerData.skin

                for componentID, component in pairs(product.data) do
                    if barberShop.components[componentID] then
                        skin[product.overlay][componentID] = component
                    end
                end

                Player.Functions.SetSkin(skin, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez changé de coupe pour ~g~$%s"):format(price))
            elseif brand == "jewelry" then
                local clothConfig = Player.PlayerData.cloth_config

                if product.overlay == "Helmet" then
                    clothConfig["BaseClothSet"].Props["Helmet"] = {
                        Drawable = tonumber(product.component),
                        Texture = tonumber(product.drawable),
                    }
                else
                    clothConfig["BaseClothSet"].Props[tostring(product.category)] = {
                        Drawable = tonumber(product.component),
                        Texture = tonumber(product.drawable),
                    }
                end

                Player.Functions.SetClothConfig(clothConfig, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez acheté un bijou pour ~g~$%s"):format(price))
            elseif brand == "ponsonbys" or brand == "suburban" or brand == "binco" then
                local clothConfig = Player.PlayerData.cloth_config
                local hasStock, clothItem = checkStock(ShopsContent[Player.PlayerData.skin.Model.Hash][Shops[brand]], product.item, amount)

                if not hasStock or clothItem == nil then
                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Ce magasin n'a pas assez de stock", "error")
                    return
                end

                for componentId, component in pairs(clothItem.data.components or {}) do
                    local compId = tostring(componentId)
                    local clothConfigName = "BaseClothSet"

                    if product.category == 19 then
                        clothConfigName = "NakedClothSet"
                    end

                    clothConfig[clothConfigName].Components[compId] = {}
                    clothConfig[clothConfigName].Components[compId].Drawable = tonumber(component.Drawable)
                    clothConfig[clothConfigName].Components[compId].Texture = tonumber(component.Texture) or 0
                    clothConfig[clothConfigName].Components[compId].Palette = tonumber(component.Palette) or 0

                    -- If the top is modified, update the torso
                    if compId == "11" then
                        local currentTop = clothConfig["BaseClothSet"].Components["11"]
                        local properTorsoDrawable = Config.Torsos[Player.PlayerData.skin.Model.Hash][currentTop.Drawable]
                        clothConfig["BaseClothSet"].Components["3"].Drawable = properTorsoDrawable
                        clothConfig["BaseClothSet"].Components["3"].Texture = 0
                        clothConfig["BaseClothSet"].Components["3"].Palette = 0
                    end
                end

                local affectedRows = MySQL.update.await("update shop_content set stock = stock - @stock where id = @id", {
                    id = product.item,
                    stock = amount,
                })
                if affectedRows then
                    clothItem.stock = clothItem.stock - amount
                end

                Player.Functions.SetClothConfig(clothConfig, false)
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez acheté un habit pour ~g~$%s"):format(price))
            else
                if Config.Products[brand][product].requiredLicense and not Player.PlayerData.metadata["licences"]["weapon"] then
                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas le permis de port d'arme", "error")
                    return
                end

                exports["soz-inventory"]:AddItem(Player.PlayerData.source, item.name, amount, nil, nil, function(success, reason)
                    if success then
                        Config.Products[brand][product].amount = Config.Products[brand][product].amount - amount
                        if Config.Products[brand][product].amount <= 0 then
                            Config.Products[brand][product].amount = 0
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

RegisterNetEvent("shops:server:CheckZkeaStock", function()
    local player = QBCore.Functions.GetPlayer(source)

    if player then
        local amount = exports["soz-inventory"]:GetItem("cabinet_storage", "cabinet_zkea", nil, true)
        TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, ("Il reste %s meubles Zkea."):format(amount));
    end
end)

---
local garmentToCategory = function(garment)
    if garment == "garment_top" or garment == "luxury_garment_top" then
        return 1
    elseif garment == "garment_pant" or garment == "luxury_garment_pant" then
        return 6
    elseif garment == "garment_shoes" or garment == "luxury_garment_shoes" then
        return 10
    elseif garment == "garment_underwear" or garment == "luxury_garment_underwear" then
        return 19
    end
end

local function getItems(products)
    if type(products) ~= "table" then
        return {}
    end

    local items = {}
    local buffer = {}

    for productId, product in pairs(products) do
        if product.stock and product.stock >= 0 then
            buffer[productId] = {id = productId, data = product}
        end
    end

    for _, product in pairs(products) do
        if product.items ~= nil then
            local list = getItems(product.items)
            for _, p in pairs(list) do
                buffer[p.id] = p
            end
        end
    end

    if products.items ~= nil then
        for _, product in pairs(products.items) do
            local list = getItems(product.items)
            for _, p in pairs(list) do
                buffer[p.id] = p
            end
        end
    end

    for _, v in pairs(buffer) do
        items[#items + 1] = v
    end

    return items
end

exports("RestockShop", function(brand, item, amount)
    local category = garmentToCategory(item)
    local sexToRefill = -1667301416

    local amount = amount

    for _ = 1, math.ceil(amount / 10) do
        local stack = 10
        if amount < 10 then
            stack = amount
        end
        amount = amount - stack

        if math.random() > 0.5 then
            sexToRefill = 1885233650
        end

        local shop = ShopsContent[sexToRefill][Shops[brand]]

        if not shop then
            return false
        end

        shop = shop.items[category]
        if not shop then
            return false
        end

        local allClothes = getItems(shop.items)
        local randomClothes = allClothes[math.random(1, #allClothes)]
        local clothesWithSameDrawable = {}

        if not randomClothes then
            return false
        end

        for _, clothe in pairs(allClothes) do
            for k, v in pairs(clothe.data.data.components or {}) do
                local originComponent = randomClothes.data.data.components[tostring(k)]

                if originComponent then
                    if k ~= "8" and k ~= "3" and tonumber(originComponent.Drawable) == tonumber(v.Drawable) then
                        clothesWithSameDrawable[clothe.id] = clothe.data
                    end
                end
            end
        end

        local clothesWithSameDrawableID = {}
        for clotheId, _ in pairs(clothesWithSameDrawable) do
            clothesWithSameDrawableID[#clothesWithSameDrawableID + 1] = clotheId
        end

        local affectedRows = MySQL.update.await("update shop_content set stock = stock + @stock where id IN (@id)",
                                                {id = clothesWithSameDrawableID, stock = stack})
        if affectedRows > 0 then
            for _, clothe in pairs(clothesWithSameDrawable) do
                clothe.stock = clothe.stock + stack
            end
        end
    end

    return true
end)

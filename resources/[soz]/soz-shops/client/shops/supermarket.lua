--- @class SupermarketShop
SupermarketShop = {}

function SupermarketShop:new(...)
    local shop = setmetatable(ShopShell:new(...), {__index = SupermarketShop})
    setmetatable(SupermarketShop, {__index = ShopShell})
    return shop
end

function SupermarketShop:getShopProducts()
    return Config.Products["supermarket"]
end

function SupermarketShop:GenerateMenu()
    shopMenu.Texture = "menu_shop_supermarket"
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(self.label)

    for itemID, item in pairs(self:getShopProducts()) do
        if QBCore.Shared.Items[item.name] and item.amount > 0 then
            shopMenu:AddButton({
                label = QBCore.Shared.Items[item.name].label,
                value = itemID,
                rightLabel = "$" .. QBCore.Shared.GroupDigits(item.price),
                select = function(val)
                    local amount = exports["soz-hud"]:Input("Quantité", 4, "1")

                    if amount and tonumber(amount) > 0 then
                        TriggerServerEvent("shops:server:pay", "supermarket", val.Value, tonumber(amount))

                        shopMenu:Close()
                        self:GenerateMenu()
                    end

                end,
            })
        end
    end

    shopMenu:Open()
end

--- Exports shop
ShopContext["247supermarket"] = SupermarketShop:new("Superette", "247supermarket", {sprite = 52, color = 2}, "ig_ashley")
ShopContext["ltdgasoline"] = SupermarketShop:new("Superette", "ltdgasoline", {sprite = 52, color = 2}, "s_m_m_autoshop_02")
ShopContext["robsliquor"] = SupermarketShop:new("Superette", "robsliquor", {sprite = 52, color = 2}, "a_m_m_genfat_02")

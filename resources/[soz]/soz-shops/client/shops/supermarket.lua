--- @class SupermarketShop
SupermarketShop = {}

function SupermarketShop:new(...)
    local shop = setmetatable(ShopShell:new(...), {__index = SupermarketShop})
    setmetatable(SupermarketShop, {__index = ShopShell})
    return shop
end

function SupermarketShop:getShopProducts()
    return Config.Products[self.brand]
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
                        TriggerServerEvent("shops:server:pay", self.brand, val.Value, tonumber(amount))

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
ShopContext["247supermarket-north"] = SupermarketShop:new("Superette", "247supermarket-north", {sprite = 52, color = 2}, (GetConvarInt("feature_halloween", 0) == 1 and "u_m_y_zombie_01") or "ig_ashley")
ShopContext["247supermarket-south"] = SupermarketShop:new("Superette", "247supermarket-south", {sprite = 52, color = 2}, (GetConvarInt("feature_halloween", 0) == 1 and "u_m_y_zombie_01") or "cs_ashley")
ShopContext["ltdgasoline-north"] = SupermarketShop:new("Superette", "ltdgasoline-north", {sprite = 52, color = 2}, (GetConvarInt("feature_halloween", 0) == 1 and "u_m_y_zombie_01") or "s_m_m_autoshop_01")
ShopContext["ltdgasoline-south"] = SupermarketShop:new("Superette", "ltdgasoline-south", {sprite = 52, color = 2}, (GetConvarInt("feature_halloween", 0) == 1 and "u_m_y_zombie_01") or "s_m_m_autoshop_02")
ShopContext["robsliquor-north"] = SupermarketShop:new("Superette", "robsliquor-north", {sprite = 52, color = 2}, (GetConvarInt("feature_halloween", 0) == 1 and "u_m_y_zombie_01") or "a_m_m_genfat_02")
ShopContext["robsliquor-south"] = SupermarketShop:new("Superette", "robsliquor-south", {sprite = 52, color = 2}, (GetConvarInt("feature_halloween", 0) == 1 and "u_m_y_zombie_01") or "a_m_m_genfat_01")

ShopContext["zkea"] = SupermarketShop:new("Zkea", "zkea", {sprite = 123, color = 69}, (GetConvarInt("feature_halloween", 0) == 1 and "u_m_y_zombie_01") or "ig_brad")


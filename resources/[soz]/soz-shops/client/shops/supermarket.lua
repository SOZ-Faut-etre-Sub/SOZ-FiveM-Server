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

local function table_deepclone(tbl)
    tbl = table.clone(tbl)
    for k, v in pairs(tbl) do
        if type(v) == "table" then
            tbl[k] = table_deepclone(v)
        end
    end
    return tbl
end

function SupermarketShop:GenerateMenu()
    local shopTexture = "menu_shop_supermarket"
    local shopContent = {}

    for itemID, item in pairs(self:getShopProducts()) do
        local sharedItem = QBCore.Shared.Items[item.name]
        if sharedItem and item.amount > 0 then
            local shopItem = table_deepclone(sharedItem)
            shopItem.price = item.price
            shopItem.amount = item.amount
            shopItem.slot = itemID

            table.insert(shopContent, shopItem)
        end
    end

    exports["soz-inventory"]:openShop(shopContent)
end

--- Exports shop
ShopContext["247supermarket-north"] = SupermarketShop:new("Superette", "247supermarket-north", {sprite = 52, color = 2}, "ig_ashley")
ShopContext["247supermarket-south"] = SupermarketShop:new("Superette", "247supermarket-south", {sprite = 52, color = 2}, "cs_ashley")
ShopContext["ltdgasoline-north"] = SupermarketShop:new("Superette", "ltdgasoline-north", {sprite = 52, color = 2}, "s_m_m_autoshop_01")
ShopContext["ltdgasoline-south"] = SupermarketShop:new("Superette", "ltdgasoline-south", {sprite = 52, color = 2}, "s_m_m_autoshop_02")
ShopContext["robsliquor-north"] = SupermarketShop:new("Superette", "robsliquor-north", {sprite = 52, color = 2}, "a_m_m_genfat_02")
ShopContext["robsliquor-south"] = SupermarketShop:new("Superette", "robsliquor-south", {sprite = 52, color = 2}, "a_m_m_genfat_01")

ShopContext["zkea"] = SupermarketShop:new("Zkea", "zkea", {sprite = 123, color = 69}, "ig_brad")

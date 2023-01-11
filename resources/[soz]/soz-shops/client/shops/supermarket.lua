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

function SupermarketShop:GenerateZkeaUpgradesMenu()
    local playerData = QBCore.Functions.GetPlayerData()
    if not playerData.apartment then return end

    local apartmentTier = playerData.apartment.tier
    local apartmentPrice = playerData.apartment.price

    shopMenu.Texture = "menu_shop_supermarket"
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(self.label)

    local cumul = 0
    for tier, upgrade in pairs(Config.Upgrades["zkea"]) do
        if apartmentTier < tier then
            local baseTierPrice = math.floor(apartmentPrice * upgrade.pricePercent / 100)
            local tierPrice = cumul + baseTierPrice
            cumul = cumul + tierPrice

            shopMenu:AddButton({
                label = "Palier " .. tier,
                value = {
                    tier = tier,
                    price = tierPrice
                },
                rightLabel = "$" .. QBCore.Shared.GroupDigits(tierPrice),
                select = function()
                    TriggerServerEvent("housing:server:UpgradePlayerApartmentTier", tier, tierPrice)
                    shopMenu:Close()
                end
            })
        else
            local label = "Acquis"
            if apartmentTier == tier then label = "Actuel" end

            shopMenu:AddButton({
                label = "Palier " .. tier,
                rightLabel = label,
            })
        end
    end

    shopMenu:Open()
end

--- Exports shop
ShopContext["247supermarket-north"] = SupermarketShop:new("Superette", "247supermarket-north", {sprite = 52, color = 2}, "ig_ashley")
ShopContext["247supermarket-south"] = SupermarketShop:new("Superette", "247supermarket-south", {sprite = 52, color = 2}, "cs_ashley")
ShopContext["ltdgasoline-north"] = SupermarketShop:new("Superette", "ltdgasoline-north", {sprite = 52, color = 2}, "s_m_m_autoshop_01")
ShopContext["ltdgasoline-south"] = SupermarketShop:new("Superette", "ltdgasoline-south", {sprite = 52, color = 2}, "s_m_m_autoshop_02")
ShopContext["robsliquor-north"] = SupermarketShop:new("Superette", "robsliquor-north", {sprite = 52, color = 2}, "a_m_m_genfat_02")
ShopContext["robsliquor-south"] = SupermarketShop:new("Superette", "robsliquor-south", {sprite = 52, color = 2}, "a_m_m_genfat_01")

ShopContext["zkea"] = SupermarketShop:new("Zkea", "zkea", {sprite = 123, color = 69}, "ig_brad")

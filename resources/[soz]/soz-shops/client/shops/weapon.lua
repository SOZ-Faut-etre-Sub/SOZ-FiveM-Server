--- @class WeaponShop
WeaponShop = {}

function WeaponShop:new(...)
    local shop = setmetatable(ShopShell:new(...), {__index = WeaponShop})
    setmetatable(WeaponShop, {__index = ShopShell})
    return shop
end

function WeaponShop:getShopProducts()
    return Config.Products["ammunation"]
end

function WeaponShop:FilterItems()
    local items = {}
    local playerData = QBCore.Functions.GetPlayerData()

    for id, product in pairs(self:getShopProducts()) do
        if not product.requiredJob and not product.requiredLicense then
            items[id] = product
        else
            if product.requiredLicense and playerData.metadata["licences"]["weapon"] == true then
                items[id] = product
            elseif product.requiredJob and product.requiredJob == playerData.job.id then
                items[id] = product
            end
        end
    end

    return items
end

function WeaponShop:GenerateMenu()
    shopMenu.Texture = "menu_shop_ammunation"
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(self.label)

    for itemID, item in pairs(self:FilterItems()) do
        if QBCore.Shared.Items[item.name] and item.amount > 0 then
            shopMenu:AddButton({
                label = QBCore.Shared.Items[item.name].label,
                value = itemID,
                rightLabel = "$" .. QBCore.Shared.GroupDigits(item.price),
                select = function(val)
                    local amount = 1
                    if item.type == "ammo" then
                        amount = exports["soz-hud"]:Input("Quantité", 4, "1")
                    end

                    if amount and tonumber(amount) > 0 then
                        TriggerServerEvent("shops:server:pay", "ammunation", val.Value, tonumber(amount))

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
ShopContext["ammunation"] = WeaponShop:new("Ammu-Nation", "ammunation", {sprite = 110, color = 17}, "s_m_y_ammucity_01")

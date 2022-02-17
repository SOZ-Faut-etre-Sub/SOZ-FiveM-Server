--- @class ShopShell
ShopShell = {}

function ShopShell.new()
    return setmetatable({}, {
        __index = ShopShell,
        __tostring = function()
            return "ShopShell"
        end,
    })
end

--- GetShopData
--- @param shop string
--- @return table
function ShopShell:GetShopData(shop)
    return Config.Locations[shop]
end

function ShopShell:FilterItems(shop)
    local items = {}
    local playerjob = QBCore.Functions.GetPlayerData().job.name

    for _, product in pairs(self:GetShopData(shop).products) do
        if not product.requiredJob then
            items[#items + 1] = product
        else
            for _, job in ipairs(product.requiredJob) do
                if playerjob == job then
                    items[#items + 1] = product
                end
            end
        end
    end

    return items
end

--- SetBanner
--- @param menu Menu
--- @param shop string
function ShopShell:SetBanner(menu, shop)
    if self:GetShopData(shop).type == "weapon" then
        menu.Texture = "menu_shop_ammunation"
    else
        menu.Texture = "menu_shop_supermarket"
    end
end

--- DisplayMenu
--- @param menu Menu
--- @param shop string
function ShopShell:GenerateMenu(menu, shop)
    if self:GetShopData(shop) == nil then
        return
    end

    menu:ClearItems()
    menu:SetSubtitle(self:GetShopData(shop).label)
    self:SetBanner(menu, shop)

    for itemID, item in pairs(self:FilterItems(shop)) do
        if QBCore.Shared.Items[item.name] and item.amount > 0 then
            local entry = menu:AddButton({
                label = QBCore.Shared.Items[item.name].label,
                value = itemID,
                rightLabel = "$" .. QBCore.Shared.GroupDigits(item.price),
            })
            entry:On("select", function(val)
                local amount = exports["soz-hud"]:Input("Quantité", 4, "1")

                if amount and tonumber(amount) > 0 then
                    TriggerServerEvent("shops:server:pay", shop, val.Value, tonumber(amount))

                    menu:Close()
                    self:GenerateMenu(menu, shop)
                end
            end)
        end
    end

    menu:Open()
end

ShopContext["shop"] = ShopShell.new()

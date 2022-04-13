QBCore = exports["qb-core"]:GetCoreObject()
shopMenu = MenuV:CreateMenu(nil, "", "menu_shop_supermarket", "soz", "shops")
ShopContext, currentShop, currentShopBrand = {}, nil, nil

for brand, shop in pairs(ShopLocation) do
    for _, zone in pairs(shop) do
        zone:onPlayerInOut(function(isInside)
            if isInside then
                currentShop = zone.name
                currentShopBrand = brand
            else
                currentShop = nil
                currentShopBrand = nil
                shopMenu:Close()
            end
        end)
    end
end

exports("GetCurrentShop", function()
    return currentShop
end)

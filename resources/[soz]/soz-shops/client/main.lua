QBCore = exports["qb-core"]:GetCoreObject()
shopMenu = MenuV:CreateMenu(nil, "", "menu_shop_supermarket", "soz", "shops")
ShopContext, currentShop, currentShopBrand = {}, nil, nil

local ShopLocations = {
    ["ammunation"] = true,
    ["supermarket"] = true,
    ["barber"] = true,
    ["ponsonbys"] = true,
    ["suburban"] = true,
    ["binco"] = true,
    ["jewelry"] = true,
    ["247supermarket"] = true,
    ["ltdgasoline"] = true,
    ["robsliquor"] = true,
    ["tattoo"] = true,
}

AddEventHandler("locations:zone:enter", function(brand, shop)
    if ShopLocations[brand] then
        currentShop = shop
        currentShopBrand = brand
    end
end)

AddEventHandler("locations:zone:exit", function(brand, shop)
    if ShopLocations[brand] then
        currentShop = nil
        currentShopBrand = nil
        shopMenu:Close()
    end
end)

exports("GetCurrentShop", function()
    return currentShop
end)

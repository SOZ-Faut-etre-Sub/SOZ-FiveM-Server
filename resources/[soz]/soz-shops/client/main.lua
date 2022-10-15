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
    ["247supermarket-north"] = true,
    ["247supermarket-south"] = true,
    ["ltdgasoline-north"] = true,
    ["ltdgasoline-south"] = true,
    ["robsliquor-north"] = true,
    ["robsliquor-south"] = true,
    ["tattoo"] = true,
    ["zkea"] = true,
}

AddEventHandler("locations:zone:enter", function(brand, shop)
    if ShopLocations[brand] then
        currentShop = shop
        currentShopBrand = brand

        if brand == "ponsonbys" or brand == "suburban" or brand == "binco" then
            TriggerEvent("soz-core:client:job:ffs:enter-clothing-shop", brand)
        end
    end
end)

AddEventHandler("locations:zone:exit", function(brand, shop)
    if ShopLocations[brand] then
        currentShop = nil
        currentShopBrand = nil
        shopMenu:Close()

        if brand == "ponsonbys" or brand == "suburban" or brand == "binco" then
            TriggerEvent("soz-core:client:job:ffs:exit-clothing-shop", brand)
        end
    end
end)

exports("GetCurrentShop", function()
    return currentShop
end)

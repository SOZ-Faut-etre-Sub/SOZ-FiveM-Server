-- Events
RegisterNetEvent("shops:client:GetShop", function()
    if currentShop then
        ShopContext[Config.Locations[currentShop].type]:GenerateMenu(shopMenu, currentShop)
    end
end)

RegisterNetEvent("shops:client:SetShopItems", function(shop, shopProducts)
    Config.Locations[shop].products = shopProducts
end)

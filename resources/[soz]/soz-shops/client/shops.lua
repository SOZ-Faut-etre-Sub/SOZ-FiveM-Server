local stonkAction = {
    event = "soz-jobs:client:stonk-collect-bag",
    icon = "fas fa-dollar-sign",
    label = "Collecter sacs d'argent",
    canInteract = function()
        return exports["soz-jobs"]:CanBagsBeCollected(currentShop)
    end,
}

CreateThread(function()
    for id, shop in pairs(ShopContext) do
        for shopId, location in pairs(Config.Locations[id]) do
            if not QBCore.Functions.GetBlip("shops_" .. id .. "_" .. shopId) then
                QBCore.Functions.CreateBlip("shops_" .. id .. "_" .. shopId,
                                            {
                    name = shop.label,
                    coords = location,
                    sprite = shop.blip.sprite,
                    color = shop.blip.color,
                })
            end

            shop:SpawnPed(location, stonkAction)
        end
    end
end)

-- Events
RegisterNetEvent("shops:client:GetShop", function()
    if currentShop then
        ShopContext[currentShopBrand]:GenerateMenu()
    end
end)

RegisterNetEvent("shops:client:SetShopItems", function(product, shopProducts)
    Config.Products[product] = shopProducts
end)

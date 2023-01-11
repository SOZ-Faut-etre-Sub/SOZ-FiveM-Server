local stonkAction = {
    icon = "c:stonk/collecter.png",
    label = "Collecter",
    canInteract = function()
        return exports["soz-core"]:CanBagsBeCollected(currentShopBrand, currentShop)
    end,
    blackoutGlobal = true,
    blackoutJob = true,
    action = function()
        TriggerServerEvent("soz-core:server:job:stonk:collect", currentShopBrand, currentShop)
    end,
}

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
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
RegisterNetEvent("shops:client:GetZkeaShop", function()
    if currentShop and currentShopBrand == "zkea" then
        ShopContext[currentShopBrand]:GenerateZkeaUpgradesMenu()
    end
end)

RegisterNetEvent("shops:client:SetShopItems", function(product, shopProducts)
    Config.Products[product] = shopProducts
end)

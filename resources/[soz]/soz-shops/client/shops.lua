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

            Config.ShopsPedEntity[shopId] = {entity = shop:SpawnPed(location), location = location}
        end
    end
    TriggerEvent("shops:client:shop:PedSpawned")
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

AddEventHandler("onResourceStop", function(resource)
    if resource ~= GetCurrentResourceName() then
        return
    end

    for id, shop in pairs(ShopContext) do
        for shopId, location in pairs(Config.Locations[id]) do
            if Config.ShopsPedEntity[shopId] and Config.ShopsPedEntity[shopId].entity and DoesEntityExist(Config.ShopsPedEntity[shopId].entity) then
                DeleteEntity(Config.ShopsPedEntity[shopId].entity)
            end
        end
    end
end)

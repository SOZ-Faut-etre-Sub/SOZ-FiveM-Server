QBCore = exports["qb-core"]:GetCoreObject()
shopMenu = MenuV:CreateMenu(nil, "", "menu_shop_supermarket", "soz", "shops")

currentShop = nil
ShopContext = {}

-- Shops
CreateThread(function()
    for id, shop in pairs(Config.Locations) do
        if not QBCore.Functions.GetBlip("shops_" .. id) then
            QBCore.Functions.CreateBlip("shops_" .. id,
                                        {
                name = shop.label,
                coords = shop.coords,
                sprite = shop.blip.sprite,
                color = shop.blip.color,
            })
        end
        exports["qb-target"]:SpawnPed({
            {
                model = shop.pedModel,
                coords = shop.coords,
                minusOne = true,
                freeze = true,
                invincible = true,
                blockevents = true,
                scenario = "WORLD_HUMAN_STAND_IMPATIENT",
                target = {
                    options = {
                        {
                            event = "shops:client:GetShop",
                            icon = "fas fa-shopping-cart",
                            label = "Accéder au magasin",
                            canInteract = function()
                                return currentShop ~= nil and (Config.Locations[currentShop].type == "weapon" or Config.Locations[currentShop].type == "shop")
                            end,
                        },
                        {
                            event = "shops:client:GetShop",
                            icon = "far fa-duck",
                            label = "Voir les tatouages",
                            canInteract = function()
                                return currentShop ~= nil and Config.Locations[currentShop].type == "tattoo"
                            end,
                        },
                    },
                    distance = 2.5,
                },
            },
        })
    end
end)

for _, shop in pairs(ShopLocation) do
    for _, zone in pairs(shop) do
        zone:onPlayerInOut(function(isInside)
            if isInside then
                currentShop = zone.name
            else
                currentShop = nil
                shopMenu:Close()
            end
        end)
    end
end

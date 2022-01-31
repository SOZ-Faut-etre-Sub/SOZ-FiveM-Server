local QBCore = exports["qb-core"]:GetCoreObject()
local shopMenu = MenuV:CreateMenu(nil, "", "menu_shop_supermarket", "soz", "shops")
local currentShop = nil

-- Shops
CreateThread(function()
    for id, shop in pairs(Config.Locations) do
        if not QBCore.Functions.GetBlip("shops_" .. id) then
            QBCore.Functions.CreateBlip("shops_" .. id, {
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
                                return currentShop ~= nil
                            end,
                        },
                    },
                    distance = 2.5,
                },
            },
        })
    end
end)

-- Events
RegisterNetEvent("shops:client:GetShop", function()
    if currentShop then
        DisplayShopMenu(currentShop)
    end
end)

RegisterNetEvent("shops:client:SetShopItems", function(shop, shopProducts)
    Config.Locations[shop].products = shopProducts
end)

-- Functions
function DisplayShopMenu(shop)
    if Config.Locations[shop] == nil then
        return
    end
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(Config.Locations[shop].label)
    if string.find(shop, "ammunation") ~= nil then
        shopMenu.Texture = "menu_shop_ammunation"
    else
        shopMenu.Texture = "menu_shop_supermarket"
    end

    local products = filterItems(Config.Locations[shop].products)

    for itemID, item in pairs(products) do
        if QBCore.Shared.Items[item.name] and item.amount > 0 then
            local entry = shopMenu:AddButton({
                label = QBCore.Shared.Items[item.name].label,
                value = itemID,
                rightLabel = "$" .. QBCore.Shared.GroupDigits(item.price),
            })
            entry:On("select", function(val)
                local amount = exports["soz-hud"]:Input("Quantité", 4, "1")

                if amount and tonumber(amount) > 0 then
                    TriggerServerEvent("shops:server:pay", shop, val.Value, tonumber(amount))

                    shopMenu:Close()
                    DisplayShopMenu(shop)
                end
            end)
        end
    end

    shopMenu:Open()
end

function filterItems(products)
    local playerJob = QBCore.Functions.GetPlayerData().job.name
    local items = {}

    for _, product in pairs(products) do
        if not product.requiredJob then
            items[#items + 1] = product
        else
            for _, job in ipairs(product.requiredJob) do
                if playerJob == job then
                    items[#items + 1] = product
                end
            end
        end
    end
    return items
end

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

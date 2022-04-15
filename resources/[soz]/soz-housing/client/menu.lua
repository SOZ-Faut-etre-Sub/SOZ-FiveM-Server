Housing.Functions = {}
Housing.Functions.Menu = {}
Housing.Menus = {}

CreateThread(function()
    Housing.Menus["housing"] = {
        menu = MenuV:CreateMenu(nil, "Les habitations !", "menu_habitation", "soz", "housing:menu"),
    }
end)

Housing.Functions.Menu.GenerateMenu = function(cb)
    --- @type Menu
    local menu = Housing.Menus["housing"].menu
    menu:ClearItems()

    cb(menu)

    if menu.IsOpen then
        MenuV:CloseAll(function()
            menu:Close()
        end)
    else
        MenuV:CloseAll(function()
            menu:Open()
        end)
    end
end

Housing.Functions.Menu.BuyHousing = function(Data)
    Housing.Functions.Menu.GenerateMenu(function(menu)
        for _, house in pairs(Data) do
            menu:AddButton({
                label = house.identifier,
                rightLabel = "$" .. house.price,
                select = function()
                    TriggerServerEvent("soz-housing:server:buy", house.identifier, house.price)
                    menu:Close()
                end,
            })
        end
    end)
end

Housing.Functions.Menu.SellHousing = function(Data)
    Housing.Functions.Menu.GenerateMenu(function(menu)
        for _, house in pairs(Data) do
            menu:AddButton({
                label = house.identifier,
                rightLabel = "$" .. house.price,
                select = function()
                    TriggerServerEvent("soz-housing:server:sell", house.identifier, house.price)
                    menu:Close()
                end,
            })
        end
    end)
end

Housing.Functions.Menu.ShowRentrer = function(Data)
    Housing.Functions.Menu.GenerateMenu(function(menu)
        for id, house in pairs(Data) do
            menu:AddButton({
                label = house.identifier,
                select = function()
                    TriggerEvent("soz-housing:client:BuildingRentrer", house.coordx, house.coordy, house.coordz, house.coordw)
                    menu:Close()
                end,
            })
        end
    end)
end

Housing.Functions.Menu.zkea = function()
    Housing.Functions.Menu.GenerateMenu(function(menu)
        menu:AddButton({
            label = "Carte des habitations",
            select = function()
                TriggerServerEvent("shops:server:pay", "house_map", nil, 1)
            end,
        })
    end)
end

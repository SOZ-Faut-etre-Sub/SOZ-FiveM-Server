Housing.Functions = {}
Housing.Functions.Menu = {}
Housing.Menus = {}

CreateThread(function()
    Housing.Menus["housing"] = {menu = MenuV:CreateMenu(nil, "Les habitations !", "menu_habitation", "soz", "housing:menu")}
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
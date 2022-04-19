
ChangeCurrentHousingMenu:On("open", function(menu)
    menu:ClearItems()

    if CurrentHousingData.building == nil then
        menu:AddButton({
            label = "zone d'entrée",
            value = nil,
            select = function()
                print("test")
            end,
        })
    end

    menu:AddButton({
        label = "zone de sortie",
        value = nil,
        select = function()
            print("test")
        end,
    })

    menu:AddButton({
        label = "Frigo",
        value = nil,
        select = function()
            print("test")
        end,
    })

    menu:AddButton({
        label = "Coffre d'argent",
        value = nil,
        select = function()
            print("test")
        end,
    })

    menu:AddButton({
        label = "Coffre d'item",
        value = nil,
        select = function()
            print("test")
        end,
    })

    menu:AddButton({
        label = "vestiare",
        value = nil,
        select = function()
            print("test")
        end,
    })
end)

CurrentHousingMenu:On("open", function(menu)
    menu:ClearItems()

    QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetHousing", function(housing)
        for item, habitation in pairs(housing) do
            menu:AddButton({
                label = habitation.identifier,
                value = ChangeCurrentHousingMenu,
                select = function()
                    CurrentHousingData = habitation
                end,
            })
        end
    end)
end)
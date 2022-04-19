ChangeCurrentBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddButton({
        label = "Afficher la Zone d'entrer",
        value = nil,
        select = function()
            zone = json.decode(CurrentHousingData.entry_zone)
            DisplayZone(zone)
        end,
    })

    menu:AddButton({
        label = "Changer la Zone d'entrer",
        value = nil,
        select = function()
            print("test")
        end,
    })
end)

CurrentBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetBuilding", function(building)
        print("test")
        for item, habitation in pairs(building) do
            menu:AddButton({
                label = habitation.building,
                value = ChangeCurrentBuildingMenu,
                select = function()
                    CurrentHousingData = habitation
                end,
            })
        end
    end)
end)

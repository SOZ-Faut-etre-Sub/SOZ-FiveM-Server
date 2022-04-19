CurrentHousingItemMenu:On("open", function(menu)
    menu:ClearItems()

    if CurrentZoneData ~= nil then
        menu:AddButton({
            label = "Afficher la zone",
            value = nil,
            select = function()
                print(CurrentZoneData)
                zone = json.decode(CurrentZoneData)
                DisplayZone(zone)
            end,
        })

        menu:AddButton({
            label = "Changer la zone",
            value = nil,
            select = function()
                print("ch")
            end,
        })
    else
        menu:AddButton({
            label = "Ajouter la zone",
            value = nil,
            select = function()
                TriggerEvent("admin:polyzone:pzcreate", "box", "custom_housing" ,{"box", "custom_housing"})
            end,
        })
    end
end)

ChangeCurrentHousingMenu:On("open", function(menu)
    menu:ClearItems()

    if CurrentHousingData.building == nil then
        menu:AddButton({
            label = "Zone d'entrée",
            value = CurrentHousingItemMenu,
            select = function()
                CurrentZoneData = CurrentHousingData.entry_zone
            end,
        })
    end

    menu:AddButton({
        label = "Zone de sortie",
        value = CurrentHousingItemMenu,
        select = function()
            CurrentZoneData = CurrentHousingData.exit_zone
        end,
    })

    menu:AddButton({
        label = "Zone du frigo",
        value = CurrentHousingItemMenu,
        select = function()
            CurrentZoneData = CurrentHousingData.fridge_position
        end,
    })

    menu:AddButton({
        label = "Zone du coffre d'argent",
        value = CurrentHousingItemMenu,
        select = function()
            CurrentZoneData = CurrentHousingData.money_position
        end,
    })

    menu:AddButton({
        label = "Zone du Coffre d'item",
        value = CurrentHousingItemMenu,
        select = function()
            CurrentZoneData = CurrentHousingData.stash_position
        end,
    })

    menu:AddButton({
        label = "Zone du vestiare",
        value = CurrentHousingItemMenu,
        select = function()
            CurrentZoneData = CurrentHousingData.closet_position
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
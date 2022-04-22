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
            value = EndHousingMenu,
            select = function()
                TriggerEvent("polyzone:pzcreate", "box", "custom_housing", {"box", "custom_housing"})
            end,
        })
    else
        menu:AddButton({
            label = "Ajouter la zone",
            value = EndHousingMenu,
            select = function()
                TriggerEvent("polyzone:pzcreate", "box", "custom_housing", {"box", "custom_housing"})
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
                zone_type = "entry_zone"
                CurrentZoneData = CurrentHousingData.entry_zone
            end,
        })
    end

    menu:AddButton({
        label = "Zone de sortie",
        value = CurrentHousingItemMenu,
        select = function()
            zone_type = "exit_zone"
            CurrentZoneData = CurrentHousingData.exit_zone
        end,
    })

    menu:AddButton({
        label = "Zone du frigo",
        value = CurrentHousingItemMenu,
        select = function()
            zone_type = "fridge_position"
            CurrentZoneData = CurrentHousingData.fridge_position
        end,
    })

    menu:AddButton({
        label = "Zone du coffre d'argent",
        value = CurrentHousingItemMenu,
        select = function()
            zone_type = "money_position"
            CurrentZoneData = CurrentHousingData.money_position
        end,
    })

    menu:AddButton({
        label = "Zone du Coffre d'item",
        value = CurrentHousingItemMenu,
        select = function()
            zone_type = "stash_position"
            CurrentZoneData = CurrentHousingData.stash_position
        end,
    })

    menu:AddButton({
        label = "Zone du vestiare",
        value = CurrentHousingItemMenu,
        select = function()
            zone_type = "closet_position"
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

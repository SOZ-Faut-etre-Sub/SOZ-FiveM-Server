CurrentHousingItemMenu:On("open", function(menu)
    menu:ClearItems()

    if CurrentZoneData ~= nil and CurrentHousingData.building == nil then
        menu:AddCheckbox({
            label = "Afficher la zone",
            value = drawZone,
            change = function()
                drawZone = not drawZone
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
    elseif CurrentHousingData.building == nil and CurrentZoneData == nil then
        menu:AddButton({
            label = "Ajouter l'habitation à un batiment",
            value = nil,
            select = function()
                menu:ClearItems()

                QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetBuilding", function(building)
                    for item, habitation in pairs(building) do
                        menu:AddButton({
                            label = habitation.building,
                            value = ChangeCurrentHousingMenu,
                            select = function()
                                TriggerServerEvent("soz-admin:server:housing:ChangeBuilding", CurrentHousingData.identifier, habitation.building)
                            end,
                        })
                    end
                end)
            end,
        })

        menu:AddButton({
            label = "Ajouter la zone d'entrée",
            value = EndHousingMenu,
            select = function()
                TriggerEvent("polyzone:pzcreate", "box", "custom_housing", {"box", "custom_housing"})
            end,
        })

    elseif CurrentHousingData.building ~= nil then
        menu:AddButton({
            label = "Changer l'habitation de batiment",
            value = nil,
            select = function()
                menu:ClearItems()

                QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetBuilding", function(building)
                    for item, habitation in pairs(building) do
                        menu:AddButton({
                            label = habitation.building,
                            value = ChangeCurrentHousingMenu,
                            select = function()
                                TriggerServerEvent("soz-admin:server:housing:ChangeBuilding", CurrentHousingData.identifier, habitation.building)
                            end,
                        })
                    end
                end)
            end,
        })

        menu:AddButton({
            label = "Supprimer Des Batiments",
            value = nil,
            select = function()
                TriggerServerEvent("soz-admin:server:housing:ChangeBuilding", CurrentHousingData.identifier, nil)
            end,
        })
    end
end)

ChangeCurrentHousingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddButton({
        label = "Changer le Nom de l'habitation",
        value = nil,
        select = function()
            NewName = exports["soz-hud"]:Input("Nom du l'habitation:", 50)
            TriggerServerEvent("soz-admin:server:housing:ChangeName", NewName, CurrentHousingData.identifier)
        end,
    })

    menu:AddButton({
        label = "Se Téléporter dans l'habitation",
        value = nil,
        select = function()
            coord = json.decode(CurrentHousingData.teleport)
            SetPedCoordsKeepVehicle(PlayerPedId(), coord.x, coord.y, coord.z)
        end,
    })

    menu:AddButton({
        label = "Zone d'entrée",
        value = CurrentHousingItemMenu,
        select = function()
            zone_type = "entry_zone"
            CurrentZoneData = CurrentHousingData.entry_zone
        end,
    })

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

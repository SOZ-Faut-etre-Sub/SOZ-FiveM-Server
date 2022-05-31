CurrentHousingItemMenu:On("open", function(menu)
    menu:ClearItems()

    local data = CurrentZoneData
    if type(data) == "string" then
        data = json.decode(CurrentZoneData)
    end

    menu:AddCheckbox({
        label = "Afficher la zone",
        value = drawZone,
        change = function()
            drawZone = not drawZone
            if next(data) ~= nil then
                DisplayZone(data)
            end
        end,
    })

    local label = "Changer la zone"
    if next(data) == nil then
        label = "Ajouter la zone"
    end
    menu:AddButton({
        label = label,
        value = EndHousingMenu,
        select = function()
            TriggerEvent("polyzone:pzcreate", "box", "custom_housing", {"box", "custom_housing"})
        end,
    })
end)

CurrentHousingBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    if CurrentHousingData.building == nil then
        menu:AddButton({
            label = "Ajouter l'habitation à un batiment",
            value = nil,
            select = function()
                menu:ClearItems()

                QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetBuilding", function(building)
                    table.sort(building, function(a, b)
                        return a.building < b.building
                    end)
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

    else
        menu:AddButton({label = string.format("Bâtiment actuel : %s", CurrentHousingData.building), disabled = true})

        menu:AddButton({
            label = "Changer l'habitation de batiment",
            value = nil,
            select = function()
                menu:ClearItems()

                QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetBuilding", function(building)
                    table.sort(building, function(a, b)
                        return a.building < b.building
                    end)
                    for item, habitation in pairs(building) do
                        menu:AddButton({
                            label = habitation.building,
                            value = ChangeCurrentHousingMenu,
                            select = function()
                                TriggerServerEvent("soz-admin:server:housing:ChangeBuilding", CurrentHousingData.identifier, habitation.building)
                                exports["soz-hud"]:DrawNotification(string.format("Cette habitation est désormais rattachée au bâtiment \"%s\"",
                                                                                  habitation.building))
                            end,
                        })
                    end
                end)
            end,
        })

        menu:AddButton({
            label = "Retirer cette habitation du bâtiment",
            value = nil,
            select = function()
                TriggerServerEvent("soz-admin:server:housing:ChangeBuilding", CurrentHousingData.identifier, nil)
                exports["soz-hud"]:DrawNotification(string.format("Cette habitation n'est plus rattachée au bâtiment \"%s\"", CurrentHousingData.building))
                menu:Close()
            end,
        })
    end
end)

ChangeCurrentHousingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddButton({label = "Gestion du bâtiment de l'habitation", value = CurrentHousingBuildingMenu})

    menu:AddButton({
        label = "Changer le Nom de l'habitation",
        value = nil,
        select = function()
            NewName = exports["soz-hud"]:Input("Nom du l'habitation:", 50)
            if NewName == nil or #NewName == 0 then
                exports["soz-hud"]:DrawNotification("Le nom ne peut pas être vide", "error")
                return
            end
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
        label = "Changer le point de TP",
        value = nil,
        select = function()
            coord = GetEntityCoords(PlayerPedId())
            TriggerServerEvent("soz-admin:server:housing:ChangeTP", CurrentHousingData.identifier, coord)
        end,
    })

    local zones = {
        {field = "entry_zone", label = "Zone d'entrée"},
        {field = "exit_zone", label = "Zone de sortie"},
        {field = "fridge_position", label = "Zone du frigo"},
        {field = "money_position", label = "Zone du coffre d'argent"},
        {field = "closet_position", label = "Zone du vestiaire"},
        {field = "garage_zone", label = "Zone du garage"},
    }
    for _, zone in ipairs(zones) do
        menu:AddButton({
            label = zone.label,
            value = CurrentHousingItemMenu,
            select = function()
                zone_type = zone.field
                CurrentZoneData = CurrentHousingData[zone.field] or "{}"
            end,
        })
    end
end)

CurrentHousingMenu:On("open", function(menu)
    menu:ClearItems()

    QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetHousing", function(housing)
        table.sort(housing, function(a, b)
            return a.identifier < b.identifier
        end)
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

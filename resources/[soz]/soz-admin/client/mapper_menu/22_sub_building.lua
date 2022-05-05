ChangeCurrentBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddCheckbox({
        label = "Afficher la Zone d'entrer",
        value = drawZone,
        change = function()
            drawZone = not drawZone
            zone = json.decode(CurrentHousingData.entry_zone)
            DisplayZone(zone)
        end,
    })

    menu:AddButton({
        label = "Changer la Zone d'entrer",
        value = EndHousingMenu,
        select = function()
            zone_type = "entry_zone"
            TriggerEvent("polyzone:pzcreate", "box", "custom_housing", {"box", "custom_housing"})
        end,
    })

    menu:AddCheckbox({
        label = "Blips",
        value = Blips,
        change = function()
            Blips = not Blips
            points = json.decode(CurrentHousingData.entry_zone)
            if Blips then
                QBCore.Functions.CreateBlip(CurrentHousingData.building, {
                    name = CurrentHousingData.building,
                    coords = vector3(points.x, points.y, points.z),
                    sprite = 106,
                    color = 1,
                    scale = 1,
                })
            else
                QBCore.Functions.RemoveBlip(CurrentHousingData.building)
            end
        end,
    })
end)

EndBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddButton({
        label = "Valider la zone",
        value = CurrentBuildingMenu,
        select = function()
            BuildingEntryZone = exports["PolyZone"]:EndPolyZone()
            TriggerServerEvent("soz-admin:server:housing:CreateBuilding", NewBuilding, BuildingEntryZone)
        end,
    })
end)

CreateBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddButton({
        label = "Créer la zone d'entrer",
        value = EndBuildingMenu,
        select = function()
            TriggerEvent("polyzone:pzcreate", "box", "custom_housing", {"box", "custom_housing"})
        end,
    })
end)

CurrentBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetBuilding", function(building)
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

    menu:AddButton({
        label = "Ajouter un batiment",
        value = nil,
        select = function()
            NewBuilding = exports["soz-hud"]:Input("Nom du batiment:", 50)
            CreateBuildingMenu()
        end,
    })

end)

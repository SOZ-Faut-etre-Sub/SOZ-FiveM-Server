local houseMenu = MenuV:InheritMenu(MapperMenu, {subtitle = "Menu pour les habitations"})
CurrentHousingMenu = MenuV:InheritMenu(houseMenu)
CurrentHousingItemMenu = MenuV:InheritMenu(houseMenu)
CurrentBuildingMenu = MenuV:InheritMenu(houseMenu, {subtitle = "Menu des batiments"})
ChangeCurrentHousingMenu = MenuV:InheritMenu(CurrentHousingMenu, {subtitle = "Modification de l'habitations"})
ChangeCurrentBuildingMenu = MenuV:InheritMenu(CurrentHousingMenu, {subtitle = "Modification du batiment"})
EndHousingMenu = MenuV:InheritMenu(houseMenu)

CurrentHousingData = {}
CurrentZoneData = {}
zone_type = nil

EndHousingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddButton({
        label = "Valider la zone",
        value = nil,
        select = function()
            TriggerEvent("polyzone:custom:endzone", CurrentHousingData.identifier, zone_type)
        end,
    })
end)

houseMenu:AddButton({label = "Modifier une habitation", value = CurrentHousingMenu})

houseMenu:AddButton({label = "Modifier un batiment", value = CurrentBuildingMenu})

houseMenu:AddButton({
    label = "Ajouter une habitation",
    value = nil,
    select = function()
        print("tbd")
    end,
})

--- Add to main menu
MapperMenu:AddButton({icon = "🏠", label = "Gestion des habitations", value = houseMenu})

local houseMenu = MenuV:InheritMenu(MapperMenu, {subtitle = "Menu pour les habitations"})
CurrentHousingMenu = MenuV:InheritMenu(houseMenu)
CurrentBuildingMenu = MenuV:InheritMenu(houseMenu, {subtitle = "Menu des batiments"})
ChangeCurrentHousingMenu = MenuV:InheritMenu(CurrentHousingMenu, {subtitle = "Modification de l'habitations"})
ChangeCurrentBuildingMenu = MenuV:InheritMenu(CurrentHousingMenu, {subtitle = "Modification du batiment"})


CurrentHousingData = {}

houseMenu:AddButton({
    label = "Modifier une habitation",
    value = CurrentHousingMenu,
})

houseMenu:AddButton({
    label = "Modifier un batiment",
    value = CurrentBuildingMenu,
})

houseMenu:AddButton({
    label = "Ajouter une habitation",
    value = nil,
    select = function()
        print("add")
    end,
})

--- Add to main menu
MapperMenu:AddButton({icon = "🏠", label = "Gestion des habitations", value = houseMenu})
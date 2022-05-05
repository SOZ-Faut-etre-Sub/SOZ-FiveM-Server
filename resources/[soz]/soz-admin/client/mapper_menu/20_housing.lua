local houseMenu = MenuV:InheritMenu(MapperMenu, {subtitle = "Menu pour les habitations"})
CurrentHousingMenu = MenuV:InheritMenu(houseMenu)
CurrentHousingItemMenu = MenuV:InheritMenu(houseMenu)
CurrentBuildingMenu = MenuV:InheritMenu(houseMenu, {subtitle = "Menu des batiments"})
ChangeCurrentHousingMenu = MenuV:InheritMenu(CurrentHousingMenu, {subtitle = "Modification de l'habitations"})
ChangeCurrentBuildingMenu = MenuV:InheritMenu(CurrentHousingMenu, {subtitle = "Modification du batiment"})
EndHousingMenu = MenuV:InheritMenu(houseMenu)
SetupHousingMenu = MenuV:InheritMenu(houseMenu)
SetupBuildingMenu = MenuV:InheritMenu(houseMenu)
CreateBuildingMenu = MenuV:InheritMenu(houseMenu)
EndBuildingMenu = MenuV:InheritMenu(houseMenu)

CurrentHousingData = {}
CurrentZoneData = {}
zone_type = nil
CreateName = nil
coord = nil
Building = nil
NewBuilding = nil
Blips = false

EndHousingMenu:On("open", function(menu)
    menu:ClearItems()

    menu:AddButton({
        label = "Valider la zone",
        value = nil,
        select = function()
            local TempZone = exports["PolyZone"]:EndPolyZone()
            TriggerServerEvent("soz-admin:server:housing", TempZone, CurrentHousingData.identifier, zone_type)
        end,
    })
end)

SetupBuildingMenu:On("open", function(menu)
    menu:ClearItems()

    for item, habitation in pairs(CurrentHousingData) do
        if habitation.building ~= nil and habitation.entry_zone ~= nil then
            menu:AddButton({
                label = habitation.building,
                value = SetupHousingMenu,
                select = function()
                    Building = habitation.building
                end,
            })
        end
    end

end)

SetupHousingMenu:On("open", function(menu)
    menu:ClearItems()

    if coord == nil then
        menu:AddButton({
            label = "Ajouter le point de TP",
            value = nil,
            select = function()
                coord = GetEntityCoords(PlayerPedId())
                SetupHousingMenu()
            end,
        })
    else
        menu:AddButton({
            label = "Changer le point de TP",
            value = nil,
            select = function()
                coord = GetEntityCoords(PlayerPedId())
            end,
        })
    end

    menu:AddButton({
        label = "Ajouter à un batiment",
        value = nil,
        select = function()
            SetupBuildingMenu()
        end,
    })

    if coord ~= nil then
        menu:AddButton({
            label = "Créer l'habitation",
            value = nil,
            select = function()
                TriggerServerEvent("soz-admin:server:housing:create", CreateName, coord, Building)
            end,
        })
    end
end)

houseMenu:AddButton({label = "Modifier une habitation", value = CurrentHousingMenu})

houseMenu:AddButton({label = "Modifier un batiment", value = CurrentBuildingMenu})

local function TestDoubleName(name)
    for item, habitation in pairs(CurrentHousingData) do
        if habitation.identifier == name then
            return false
        end
    end
    return true
end

local function CreateHousing()
    CreateName = exports["soz-hud"]:Input("Nom de l'habitation:", 50)
    if string.find(CreateName, " ") ~= nil then
        exports["soz-hud"]:DrawNotification("le nom de l'habitation doit être tout attacher")
    else
        if TestDoubleName(CreateName) then
            SetupHousingMenu()
        else
            exports["soz-hud"]:DrawNotification("Le nom est déjà utiliser")
        end
    end
end

houseMenu:AddButton({
    label = "Ajouter une habitation",
    value = nil,
    select = function()
        QBCore.Functions.TriggerCallback("soz-admin:housing:server:GetHousing", function(housing)
            CurrentHousingData = housing
        end)
        CreateHousing()
    end,
})

--- Add to main menu
MapperMenu:AddButton({icon = "🏠", label = "Gestion des habitations", value = houseMenu})

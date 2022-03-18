function CreateClothMenu(createCharacterMenu, playerId, skin)
    local clothMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Vêtements"})

    return clothMenu
end

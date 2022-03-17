function CreateMakeupMenu(createCharacterMenu, playerId, skin)
    local makeupMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Maquillage"})

    return makeupMenu
end

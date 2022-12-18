function CreateMakeupMenuItems(makeupMenu, playerId, skin)
    -- Rouge à lèvres
    makeupMenu:AddTitle({label = "Maquillage"})
    CreateSliderList(makeupMenu, "Type", skin.Makeup.FullMakeupType, Labels.Makeup, function(value)
        skin.Makeup.FullMakeupType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(makeupMenu, "Densité", skin.Makeup.FullMakeupOpacity, function(value)
        skin.Makeup.FullMakeupOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    makeupMenu:AddCheckbox({label = "Utiliser couleur par défaut", value = skin.Makeup.FullMakeupDefaultColor}):On("change", function(_, value)
        skin.Makeup.FullMakeupDefaultColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(makeupMenu, "Couleur principale", skin.Makeup.FullMakeupPrimaryColor, Colors.Makeup, function(value)
        skin.Makeup.FullMakeupPrimaryColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(makeupMenu, "Couleur secondaire", skin.Makeup.FullMakeupSecondaryColor, Colors.Makeup, function(value)
        skin.Makeup.FullMakeupSecondaryColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Rouge à lèvres
    makeupMenu:AddTitle({label = "Blush"})
    CreateSliderList(makeupMenu, "Type", skin.Makeup.BlushType, Labels.Blush, function(value)
        skin.Makeup.BlushType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(makeupMenu, "Densité", skin.Makeup.BlushOpacity, function(value)
        skin.Makeup.BlushOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(makeupMenu, "Couleur du blush", skin.Makeup.BlushColor, Colors.Makeup, function(value)
        skin.Makeup.BlushColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Rouge à lèvres
    makeupMenu:AddTitle({label = "Rouge à lèvres"})
    CreateSliderList(makeupMenu, "Type", skin.Makeup.LipstickType, Labels.Lipstick, function(value)
        skin.Makeup.LipstickType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(makeupMenu, "Densité", skin.Makeup.LipstickOpacity, function(value)
        skin.Makeup.LipstickOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(makeupMenu, "Couleur des cheveux", skin.Makeup.LipstickColor, Colors.Makeup, function(value)
        skin.Makeup.LipstickColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return makeupMenu
end

function CreateMakeupMenu(createCharacterMenu, playerId, skin)
    local makeupMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Maquillage"})

    makeupMenu:On("open", function()
        CreateMakeupMenuItems(makeupMenu, playerId, skin)
    end)

    makeupMenu:On("close", function()
        makeupMenu:ClearItems()
    end)

    return makeupMenu
end

local function CreateMaleHairItems(hairMenu, playerId, skin)
    -- Cheveux
    hairMenu:AddTitle({label = "Cheveux"})
    CreateSliderList(hairMenu, "Type", skin.Hair.HairType, Labels.HairMale, function(value)
        skin.Hair.HairType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur", skin.Hair.HairColor, Colors.Hair, function(value)
        skin.Hair.HairColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur secondaire", skin.Hair.HairSecondaryColor, Colors.Hair, function(value)
        skin.Hair.HairSecondaryColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Sourcils
    hairMenu:AddTitle({label = "Sourcils"})
    CreateSliderList(hairMenu, "Type", skin.Hair.EyebrowType, Labels.Eyebrow, function(value)
        skin.Hair.EyebrowType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(hairMenu, "Densité", skin.Hair.EyebrowOpacity, function(value)
        skin.Hair.EyebrowOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur", skin.Hair.EyebrowColor, Colors.Hair, function(value)
        skin.Hair.EyebrowColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(hairMenu, "Longueur", skin.FaceTrait.EyebrowForward, function(value)
        skin.FaceTrait.EyebrowForward = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Barbe
    hairMenu:AddTitle({label = "Barbe"})
    CreateSliderList(hairMenu, "Type", skin.Hair.BeardType, Labels.BeardMale, function(value)
        skin.Hair.BeardType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(hairMenu, "Densité", skin.Hair.BeardOpacity, function(value)
        skin.Hair.BeardOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur", skin.Hair.BeardColor, Colors.Hair, function(value)
        skin.Hair.BeardColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Poils
    hairMenu:AddTitle({label = "Poils"})
    CreateSliderList(hairMenu, "Poils", skin.Hair.ChestHairType, Labels.ChestHair, function(value)
        skin.Hair.ChestHairType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(hairMenu, "Densité", skin.Hair.ChestHairOpacity, function(value)
        skin.Hair.ChestHairOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur des poils", skin.Hair.ChestHairColor, Colors.Hair, function(value)
        skin.Hair.ChestHairColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
end

local function CreateFemaleHairItems(hairMenu, playerId, skin)
    -- Cheveux
    hairMenu:AddTitle({label = "Cheveux"})
    CreateSliderList(hairMenu, "Cheveux", skin.Hair.HairType, Labels.HairFemale, function(value)
        skin.Hair.HairType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur des cheveux", skin.Hair.HairColor, Colors.Hair, function(value)
        skin.Hair.HairColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Sourcils
    hairMenu:AddTitle({label = "Sourcils"})
    CreateSliderList(hairMenu, "Sourcils", skin.Hair.EyebrowType, Labels.Eyebrow, function(value)
        skin.Hair.EyebrowType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(hairMenu, "Densité", skin.Hair.EyebrowOpacity, function(value)
        skin.Hair.EyebrowOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur des sourcils", skin.Hair.EyebrowColor, Colors.Hair, function(value)
        skin.Hair.EyebrowColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(hairMenu, "Longueur des sourcils", skin.FaceTrait.EyebrowForward, function(value)
        skin.FaceTrait.EyebrowForward = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Poils
    hairMenu:AddTitle({label = "Poils"})
    CreateSliderList(hairMenu, "Poils", skin.Hair.ChestHairType, Labels.ChestHair, function(value)
        skin.Hair.ChestHairType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeOpacitySliderItem(hairMenu, "Densité", skin.Hair.ChestHairOpacity, function(value)
        skin.Hair.ChestHairOpacity = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur des poils", skin.Hair.ChestHairColor, Colors.Hair, function(value)
        skin.Hair.ChestHairColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
end

function CreateHairMenu(createCharacterMenu, playerId, skin)
    local hairMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Coiffure"})

    hairMenu:On("open", function()
        if skin.Model.Hash == GetHashKey("mp_m_freemode_01") then
            CreateMaleHairItems(hairMenu, playerId, skin)
        else
            CreateFemaleHairItems(hairMenu, playerId, skin)
        end
    end)

    hairMenu:On("close", function()
        hairMenu:ClearItems()
    end)

    return hairMenu
end

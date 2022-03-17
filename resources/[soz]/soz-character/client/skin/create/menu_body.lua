function CreateBodyMenu(createCharacterMenu, playerId, skin)
    local bodyMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Physique"})

    -- Front
    CreateSliderList(bodyMenu, "Rides", skin.FaceTrait.Ageing, Labels.Blemish, function(value)
        skin.FaceTrait.Ageing = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Largeur du front", skin.FaceTrait.ChimpBoneWidth, function(value)
        skin.FaceTrait.ChimpBoneWidth = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Taille du front", skin.FaceTrait.ChimpBoneLength, function(value)
        skin.FaceTrait.ChimpBoneLength = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Bas du front", skin.FaceTrait.ChimpBoneLower, function(value)
        skin.FaceTrait.ChimpBoneLower = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Sourcils
    CreateRangeSizeItem(bodyMenu, "Longueur des sourcils", skin.FaceTrait.EyebrowForward, function(value)
        skin.FaceTrait.EyebrowForward = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Oeils
    CreateSliderList(bodyMenu, "Couleur des yeux", skin.FaceTrait.EyeColor, Labels.Eye, function(value)
        skin.FaceTrait.EyeColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Ouverture des yeux", skin.FaceTrait.EyesOpening, function(value)
        skin.FaceTrait.EyesOpening = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Nez
    CreateRangeSizeItem(bodyMenu, "Largeur du nez", skin.FaceTrait.NoseWidth, function(value)
        skin.FaceTrait.NoseWidth = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Hauteur pointe du nez", skin.FaceTrait.NosePeakHeight, function(value)
        skin.FaceTrait.NosePeakHeight = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Taille pointe du nez", skin.FaceTrait.NosePeakLength, function(value)
        skin.FaceTrait.NosePeakLength = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Hauteur du nez", skin.FaceTrait.NoseBoneHigh, function(value)
        skin.FaceTrait.NoseBoneHigh = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Bas du nez", skin.FaceTrait.NosePeakLower, function(value)
        skin.FaceTrait.NosePeakLower = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Axe du nez", skin.FaceTrait.NoseBoneTwist, function(value)
        skin.FaceTrait.NoseBoneTwist = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Joues
    CreateSliderList(bodyMenu, "Taches sur le visage", skin.FaceTrait.Blemish, Labels.Blemish, function(value)
        skin.FaceTrait.Blemish = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateSliderList(bodyMenu, "Rougeurs", skin.FaceTrait.Ageing, Labels.Complexion, function(value)
        skin.FaceTrait.Complexion = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateSliderList(bodyMenu, "Grains de beauté", skin.FaceTrait.Moles, Labels.Moles, function(value)
        skin.FaceTrait.Moles = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Hauteur des joues", skin.FaceTrait.CheeksBoneHigh, function(value)
        skin.FaceTrait.CheeksBoneHigh = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Largeur des joues", skin.FaceTrait.CheeksBoneWidth, function(value)
        skin.FaceTrait.CheeksBoneWidth = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Taille des joues", skin.FaceTrait.CheeksWidth, function(value)
        skin.FaceTrait.CheeksWidth = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Bouche
    CreateRangeSizeItem(bodyMenu, "Epaisseur des lèvres", skin.FaceTrait.LipsThickness, function(value)
        skin.FaceTrait.LipsThickness = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Machoire
    CreateRangeSizeItem(bodyMenu, "Largeur de la machoire", skin.FaceTrait.JawBoneWidth, function(value)
        skin.FaceTrait.JawBoneWidth = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Avancement de la machoire", skin.FaceTrait.JawBoneBackLength, function(value)
        skin.FaceTrait.JawBoneBackLength = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Cou
    CreateRangeSizeItem(bodyMenu, "Epaisseur du cou", skin.FaceTrait.NeckThickness, function(value)
        skin.FaceTrait.NeckThickness = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Corps
    CreateSliderList(bodyMenu, "Taches sur le corps", skin.FaceTrait.BodyBlemish, Labels.BodyBlemishes, function(value)
        skin.FaceTrait.BodyBlemish = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateSliderList(bodyMenu, "Extra taches sur le corps", skin.FaceTrait.AddBodyBlemish, Labels.AddBodyBlemishes, function(value)
        skin.FaceTrait.AddBodyBlemish = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return bodyMenu
end

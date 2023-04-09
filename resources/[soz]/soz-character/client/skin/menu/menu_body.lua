local function CreateBodyMenuItems(bodyMenu, playerId, skin)
    -- Peau
    bodyMenu:AddTitle({label = "Peau"})

    CreateSliderList(bodyMenu, "Rides", skin.FaceTrait.Ageing, Labels.Blemish, function(value)
        skin.FaceTrait.Ageing = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateSliderList(bodyMenu, "Tâches sur le visage", skin.FaceTrait.Blemish, Labels.Blemish, function(value)
        skin.FaceTrait.Blemish = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateSliderList(bodyMenu, "Rougeurs", skin.FaceTrait.Complexion, Labels.Complexion, function(value)
        skin.FaceTrait.Complexion = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateSliderList(bodyMenu, "Grains de beauté", skin.FaceTrait.Moles, Labels.Moles, function(value)
        skin.FaceTrait.Moles = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Front
    bodyMenu:AddTitle({label = "Front"})

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
    bodyMenu:AddTitle({label = "Yeux"})

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
    bodyMenu:AddTitle({label = "Nez"})

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

    bodyMenu:AddTitle({label = "Joues"})

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
    bodyMenu:AddTitle({label = "Bouche"})

    CreateRangeSizeItem(bodyMenu, "Epaisseur des lèvres", skin.FaceTrait.LipsThickness, function(value)
        skin.FaceTrait.LipsThickness = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Machoire
    bodyMenu:AddTitle({label = "Mâchoire"})
    CreateRangeSizeItem(bodyMenu, "Largeur de la mâchoire", skin.FaceTrait.JawBoneWidth, function(value)
        skin.FaceTrait.JawBoneWidth = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateRangeSizeItem(bodyMenu, "Avancement de la mâchoire", skin.FaceTrait.JawBoneBackLength, function(value)
        skin.FaceTrait.JawBoneBackLength = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Cou
    bodyMenu:AddTitle({label = "Cou"})

    CreateRangeSizeItem(bodyMenu, "Epaisseur du cou", skin.FaceTrait.NeckThickness, function(value)
        skin.FaceTrait.NeckThickness = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    -- Corps
    bodyMenu:AddTitle({label = "Corps"})

    CreateSliderList(bodyMenu, "Tâches sur le corps", skin.FaceTrait.BodyBlemish, Labels.BodyBlemishes, function(value)
        skin.FaceTrait.BodyBlemish = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateSliderList(bodyMenu, "Extra tâches sur le corps", skin.FaceTrait.AddBodyBlemish, Labels.AddBodyBlemishes, function(value)
        skin.FaceTrait.AddBodyBlemish = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return bodyMenu
end

function CreateBodyMenu(createCharacterMenu, playerId, skin)
    local bodyMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Physique"})

    bodyMenu:On("open", function()
        CreateBodyMenuItems(bodyMenu, playerId, skin)
    end)

    bodyMenu:On("close", function()
        bodyMenu:ClearItems()
    end)

    return bodyMenu
end

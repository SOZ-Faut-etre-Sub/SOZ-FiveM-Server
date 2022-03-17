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

function CreateMaleHairItems(hairMenu, playerId, skin)
    hairMenu:AddTitle({ label = "Cheveux" })

    CreateSliderList(hairMenu, "Cheveux", skin.Hair.HairType, Labels.HairMale, function(value)
        skin.Hair.HairType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    CreateColorSliderList(hairMenu, "Couleur des cheveux", skin.Hair.HairColor, Colors.Hair, function(value)
        skin.Hair.HairColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    hairMenu:AddTitle({ label = "Sourcils" })

    CreateRangeSizeItem(hairMenu, "Longueur des sourcils", skin.FaceTrait.EyebrowForward, function(value)
        skin.FaceTrait.EyebrowForward = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    hairMenu:AddTitle({ label = "Barbe" })


    hairMenu:AddTitle({ label = "Poils" })
end

function CreateFemaleHairItems(hairMenu, playerId, skin)
    hairMenu:AddTitle({ label = "Cheveux" })

    CreateSliderList(hairMenu, "Cheveux", skin.Hair.HairType, Labels.HairFemale, function(value)
        skin.Hair.HairType = value
        ApplyPlayerBodySkin(playerId, skin)
    end)
    CreateColorSliderList(hairMenu, "Couleur des cheveux", skin.Hair.HairColor, Colors.Hair, function(value)
        skin.Hair.HairColor = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    hairMenu:AddTitle({ label = "Sourcils" })

    CreateRangeSizeItem(hairMenu, "Longueur des sourcils", skin.FaceTrait.EyebrowForward, function(value)
        skin.FaceTrait.EyebrowForward = value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    hairMenu:AddTitle({ label = "Poils" })
end

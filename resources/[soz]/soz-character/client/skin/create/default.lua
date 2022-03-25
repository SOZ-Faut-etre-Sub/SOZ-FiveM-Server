function GetDefaultBodySkin(gender)
    local modelHash = GetHashKey("mp_m_freemode_01")

    if gender == 1 then
        modelHash = GetHashKey("mp_f_freemode_01")
    end

    return {
        Model = {Hash = modelHash, Father = 0, Mother = 23, ShapeMix = 0.5, SkinMix = 0.5},
        Hair = {
            HairType = 0,
            HairColor = 0,
            HairSecondaryColor = 0,
            EyebrowType = -1,
            EyebrowColor = 0,
            BeardType = -1,
            BeardColor = 0,
            BeardSecondaryColor = 0,
            ChestHairType = -1,
            ChestHairColor = 0,
        },
        FaceTrait = {
            EyeColor = -1,
            Blemish = -1,
            Ageing = -1,
            Complexion = -1,
            Moles = -1,
            BodyBlemish = -1,
            AddBodyBlemish = -1,
            CheeksBoneHigh = 0.0,
            CheeksBoneWidth = 0.0,
            CheeksWidth = 0.0,
            ChimpBoneLength = 0.0,
            ChimpBoneLower = 0.0,
            ChimpBoneWidth = 0.0,
            ChimpHole = 0.0,
            EyebrowForward = 0.0,
            EyebrowHigh = 0.0,
            EyesOpening = 0.0,
            JawBoneBackLength = 0.0,
            JawBoneWidth = 0.0,
            LipsThickness = 0.0,
            NeckThickness = 0.0,
            NoseBoneHigh = 0.0,
            NoseBoneTwist = 0.0,
            NosePeakLength = 0.0,
            NosePeakLower = 0.0,
            NosePeakHeight = 0.0,
            NoseWidth = 0.0,
        },
        Makeup = {
            LipstickType = -1,
            LipstickColor = 0,
            BlushType = -1,
            BlushColor = 0,
            FullMakeupType = -1,
            FullMakeupDefaultColor = true,
            FullMakeupPrimaryColor = 0,
            FullMakeupSecondaryColor = 0,
        },
        Tattoos = {},
    }
end

function GetDefaultClothConfig(baseClothSet, nakedClothSet)
    return {
        BaseClothSet = baseClothSet,
        NakedClothSet = nakedClothSet, -- Override everything if naked config is true
        JobClothSet = nil, -- Job related clothing, override base cloth
        TemporaryClothSet = nil, -- Temporary clothing (by using an item), override job cloth, only one can be set
        Config = {Naked = false, ShowMask = false, HideGlasses = false, ShowHelmet = false},
    }
end

function GetMaleDefaultBaseClothSet()
    return {
        Components = {
            [ComponentType.Mask] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Arms] = {Drawable = 15, Texture = 0, Palette = 0},
            [ComponentType.Pants] = {Drawable = 64, Texture = 0, Palette = 0},
            [ComponentType.Bag] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Shoes] = {Drawable = 75, Texture = 18, Palette = 0},
            [ComponentType.Chain] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Top] = {Drawable = 15, Texture = 0, Palette = 0},
            [ComponentType.Bulletproof] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Decals] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Torso] = {Drawable = 260, Texture = 2, Palette = 0},
        },
        Props = {
            [PropType.Head] = nil,
            [PropType.Glasses] = nil,
            [PropType.Ear] = nil,
            [PropType.LeftHand] = nil,
            [PropType.RightHand] = nil,
        },
    }
end

function GetFemaleDefaultBaseClothSet()
    return {
        Components = {
            [ComponentType.Mask] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Arms] = {Drawable = 15, Texture = 0, Palette = 0},
            [ComponentType.Pants] = {Drawable = 66, Texture = 0, Palette = 0},
            [ComponentType.Bag] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Shoes] = {Drawable = 35, Texture = 0, Palette = 0},
            [ComponentType.Chain] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Top] = {Drawable = 2, Texture = 0, Palette = 0},
            [ComponentType.Bulletproof] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Decals] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Torso] = {Drawable = 17, Texture = 0, Palette = 0},
        },
        Props = {
            [PropType.Head] = nil,
            [PropType.Glasses] = nil,
            [PropType.Ear] = nil,
            [PropType.LeftHand] = nil,
            [PropType.RightHand] = nil,
        },
    }
end

function GetMaleDefaultNakedClothSet()
    return {
        Components = {
            [ComponentType.Mask] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Arms] = {Drawable = 15, Texture = 0, Palette = 0},
            [ComponentType.Pants] = {Drawable = 61, Texture = 0, Palette = 0},
            [ComponentType.Bag] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Shoes] = {Drawable = 34, Texture = 0, Palette = 0},
            [ComponentType.Chain] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Top] = {Drawable = 15, Texture = 0, Palette = 0},
            [ComponentType.Bulletproof] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Decals] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Torso] = {Drawable = 15, Texture = 0, Palette = 0},
        },
        Props = {
            [PropType.Head] = nil,
            [PropType.Glasses] = nil,
            [PropType.Ear] = nil,
            [PropType.LeftHand] = nil,
            [PropType.RightHand] = nil,
        },
    }
end

function GetFemaleDefaultNakedClothSet()
    return {
        Components = {
            [ComponentType.Mask] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Arms] = {Drawable = 15, Texture = 0, Palette = 0},
            [ComponentType.Pants] = {Drawable = 19, Texture = 0, Palette = 0},
            [ComponentType.Bag] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Shoes] = {Drawable = 35, Texture = 0, Palette = 0},
            [ComponentType.Chain] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Top] = {Drawable = 2, Texture = 0, Palette = 0},
            [ComponentType.Bulletproof] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Decals] = {Drawable = 0, Texture = 0, Palette = 0},
            [ComponentType.Torso] = {Drawable = 18, Texture = 0, Palette = 0},
        },
        Props = {
            [PropType.Head] = nil,
            [PropType.Glasses] = nil,
            [PropType.Ear] = nil,
            [PropType.LeftHand] = nil,
            [PropType.RightHand] = nil,
        },
    }
end

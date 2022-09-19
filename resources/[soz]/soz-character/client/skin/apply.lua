local function ApplyPlayerModelHash(playerId, hash)
    if hash == GetEntityModel(GetPlayerPed(playerId)) then
        return
    end

    if not IsModelInCdimage(hash) or not IsModelValid(hash) then
        return
    end

    RequestModel(hash)

    while not HasModelLoaded(hash) do
        Wait(0)
    end

    SetPlayerModel(playerId, hash)
end

local function ApplyPlayerModel(playerId, model)
    ApplyPlayerModelHash(playerId, model.Hash)

    local ped = GetPlayerPed(playerId)

    SetPedHeadBlendData(ped, model.Father, model.Mother, 0, model.Father, model.Mother, 0, model.ShapeMix, model.SkinMix, 0, false);
end

local function ApplyPedHair(ped, hair)
    SetPedComponentVariation(ped, ComponentType.Hair, hair.HairType, 0, 0);
    SetPedHairColor(ped, hair.HairColor, hair.HairSecondaryColor or 0);
    SetPedHeadOverlay(ped, HeadOverlayType.Eyebrows, hair.EyebrowType, hair.EyebrowOpacity or 1.0);
    SetPedHeadOverlayColor(ped, HeadOverlayType.Eyebrows, 1, hair.EyebrowColor, 0);
    SetPedHeadOverlay(ped, HeadOverlayType.FacialHair, hair.BeardType, hair.BeardOpacity or 1.0);
    SetPedHeadOverlayColor(ped, HeadOverlayType.FacialHair, 1, hair.BeardColor, 0);
    SetPedHeadOverlay(ped, HeadOverlayType.ChestHair, hair.ChestHairType, hair.ChestHairOpacity or 1.0);
    SetPedHeadOverlayColor(ped, HeadOverlayType.ChestHair, 1, hair.ChestHairColor, 0);
end

local function ApplyPedFaceTrait(ped, faceTrait)
    SetPedEyeColor(ped, faceTrait.EyeColor);
    SetPedHeadOverlay(ped, HeadOverlayType.Blemishes, faceTrait.Blemish, 1.0);
    SetPedHeadOverlay(ped, HeadOverlayType.Ageing, faceTrait.Ageing, 1.0);
    SetPedHeadOverlay(ped, HeadOverlayType.Complexion, faceTrait.Complexion, 1.0);
    SetPedHeadOverlay(ped, HeadOverlayType.Moles, faceTrait.Moles, 1.0);
    SetPedHeadOverlay(ped, HeadOverlayType.BodyBlemishes, faceTrait.BodyBlemish, 1.0);
    SetPedHeadOverlay(ped, HeadOverlayType.AddBodyBlemishes, faceTrait.AddBodyBlemish, 1.0);
    SetPedFaceFeature(ped, FaceFeatureType.CheeksBoneHigh, faceTrait.CheeksBoneHigh);
    SetPedFaceFeature(ped, FaceFeatureType.CheeksBoneWidth, faceTrait.CheeksBoneWidth);
    SetPedFaceFeature(ped, FaceFeatureType.CheeksWidth, faceTrait.CheeksWidth);
    SetPedFaceFeature(ped, FaceFeatureType.ChimpBoneLength, faceTrait.ChimpBoneLength);
    SetPedFaceFeature(ped, FaceFeatureType.ChimpBoneLowering, faceTrait.ChimpBoneLower);
    SetPedFaceFeature(ped, FaceFeatureType.ChimpBoneWidth, faceTrait.ChimpBoneWidth);
    SetPedFaceFeature(ped, FaceFeatureType.ChimpHole, faceTrait.ChimpHole);
    SetPedFaceFeature(ped, FaceFeatureType.EyebrowForward, faceTrait.EyebrowForward);
    SetPedFaceFeature(ped, FaceFeatureType.EyebrowHigh, faceTrait.EyebrowHigh);
    SetPedFaceFeature(ped, FaceFeatureType.EyesOpening, faceTrait.EyesOpening);
    SetPedFaceFeature(ped, FaceFeatureType.JawBoneBackLength, faceTrait.JawBoneBackLength);
    SetPedFaceFeature(ped, FaceFeatureType.JawBoneWidth, faceTrait.JawBoneWidth);
    SetPedFaceFeature(ped, FaceFeatureType.LipsThickness, faceTrait.LipsThickness);
    SetPedFaceFeature(ped, FaceFeatureType.NeckThickness, faceTrait.NeckThickness);
    SetPedFaceFeature(ped, FaceFeatureType.NoseBoneHigh, faceTrait.NoseBoneHigh);
    SetPedFaceFeature(ped, FaceFeatureType.NoseBoneTwist, faceTrait.NoseBoneTwist);
    SetPedFaceFeature(ped, FaceFeatureType.NosePeakLength, faceTrait.NosePeakLength);
    SetPedFaceFeature(ped, FaceFeatureType.NosePeakLowering, faceTrait.NosePeakLower);
    SetPedFaceFeature(ped, FaceFeatureType.NosePeakHeight, faceTrait.NosePeakHeight);
    SetPedFaceFeature(ped, FaceFeatureType.NoseWidth, faceTrait.NoseWidth);
end

local function ApplyPedMakeup(ped, makeup)
    SetPedHeadOverlay(ped, HeadOverlayType.Lipstick, makeup.LipstickType, makeup.LipstickOpacity or 1.0);
    SetPedHeadOverlayColor(ped, HeadOverlayType.Lipstick, 2, makeup.LipstickColor, 0);
    SetPedHeadOverlay(ped, HeadOverlayType.Blush, makeup.BlushType, makeup.BlushOpacity or 1.0);
    SetPedHeadOverlayColor(ped, HeadOverlayType.Blush, 2, makeup.BlushColor, 0);
    SetPedHeadOverlay(ped, HeadOverlayType.Makeup, makeup.FullMakeupType, makeup.FullMakeupOpacity or 1.0);

    if makeup.FullMakeupDefaultColor then
        SetPedHeadOverlayColor(ped, HeadOverlayType.Makeup, 0, 0, 0);
    else
        SetPedHeadOverlayColor(ped, HeadOverlayType.Makeup, 2, makeup.FullMakeupPrimaryColor, makeup.FullMakeupSecondaryColor);
    end
end

local function ApplyPedTattoos(ped, tattoos)
    for _, tattoo in pairs(tattoos) do
        AddPedDecorationFromHashes(ped, tattoo.Collection, tattoo.Overlay)
    end
end

local function ApplyPedProps(ped, skin)
    for overlay, category in pairs(PropType) do
        if skin[overlay] then
            SetPedPropIndex(ped, category, skin[overlay].Drawable, skin[overlay].Texture, 2)
        end
    end
end

local function Clone(obj)
    if type(obj) ~= "table" then
        return obj
    end

    local res = {}

    for k, v in pairs(obj) do
        res[Clone(k)] = Clone(v)
    end

    return res
end

function MergeClothSet(base, override)
    for componentId, component in pairs(override.Components or {}) do
        base.Components[tostring(componentId)] = Clone(component)
    end

    for propId, prop in pairs(override.Props or {}) do
        base.Props[tostring(propId)] = Clone(prop)
    end

    return base
end

local function ApplyPedClothSet(ped, clothSet)
    for componentId, component in pairs(clothSet.Components) do
        SetPedComponentVariation(ped, tonumber(componentId), component.Drawable, component.Texture or 0, component.Palette or 0);
    end

    for _, propId in pairs(PropType) do
        local prop = clothSet.Props[tostring(propId)]
        if tonumber(propId) ~= nil then
            if prop == nil or prop.Clear == true then
                ClearPedProp(ped, tonumber(propId))
            else
                SetPedPropIndex(ped, tonumber(propId), prop.Drawable, prop.Texture or 0, prop.Palette or 0)
            end

        end
    end
end

function ApplyPlayerBodySkin(playerId, bodySkin)
    ApplyPlayerModel(playerId, bodySkin.Model)

    -- Get ped id after changing model, as changing the model create a new ped instead of editing the existing one
    local ped = GetPlayerPed(playerId)
    ClearPedDecorations(ped)

    ApplyPedHair(ped, bodySkin.Hair)
    ApplyPedFaceTrait(ped, bodySkin.FaceTrait)
    ApplyPedMakeup(ped, bodySkin.Makeup)
    ApplyPedTattoos(ped, bodySkin.Tattoos or {})
    ApplyPedProps(ped, bodySkin)
end

function CanApplyBaseHeadProp(clothConfig)
    -- Tl;dr: You can use the base head if the job set is not forbidding it with Clear = true.
    if clothConfig.JobClothSet ~= nil and #clothConfig.JobClothSet.Props > 0 then
        local jobHeadProp = clothConfig.JobClothSet.Props[tostring(PropType.Head)]
        if jobHeadProp ~= nil and jobHeadProp.Clear ~= true and #clothConfig["BaseClothSet"].Props > 0 then
            return true
        end
    end
    return false
end

function ClothConfigComputeToClothSet(clothConfig)
    local clothSet = Clone(clothConfig.BaseClothSet)

    if clothConfig.JobClothSet ~= nil then
        clothSet = MergeClothSet(clothSet, clothConfig.JobClothSet)
    end

    if clothConfig.TemporaryClothSet ~= nil then
        clothSet = MergeClothSet(clothSet, clothConfig.TemporaryClothSet)
    end

    if clothConfig.Config.Naked then
        clothSet = MergeClothSet(clothSet, clothConfig.NakedClothSet)
    end

    local hasHelmet = clothConfig["BaseClothSet"].Props[PropType.Helmet] ~= nil
    if not hasHelmet then
        SetPedConfigFlag(PlayerPedId(), 34, hasHelmet)
    end
    if clothConfig.Config.ShowHelmet and hasHelmet then
        local override = {Props = {[PropType.Head] = clothConfig["BaseClothSet"].Props[PropType.Helmet]}}

        clothSet = MergeClothSet(clothSet, override)
    elseif clothConfig.Config.HideHead then
        local override = {Props = {[PropType.Head] = {Clear = true}}}

        clothSet = MergeClothSet(clothSet, override)
    else
        if CanApplyBaseHeadProp(clothConfig) then
            local override = {Props = {[PropType.Head] = clothConfig["BaseClothSet"].Props[tostring(PropType.Head)]}}

            clothSet = MergeClothSet(clothSet, override)
        end
    end

    if clothConfig.Config.HideMask then
        local override = {
            Components = {[ComponentType.Mask] = clothConfig.NakedClothSet.Components[ComponentType.Mask]},
        }

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideGlasses then
        local override = {Props = {[PropType.Glasses] = {Clear = true}}}

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideEar then
        local override = {Props = {[PropType.Ear] = {Clear = true}}}

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideChain then
        local override = {
            Components = {[ComponentType.Chain] = clothConfig.NakedClothSet.Components[ComponentType.Chain]},
        }

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideBulletproof then
        local override = {
            Components = {[ComponentType.Bulletproof] = clothConfig.NakedClothSet.Components[ComponentType.Bulletproof]},
        }

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideTop then
        local override = {
            Components = {
                [ComponentType.Arms] = clothConfig.NakedClothSet.Components[ComponentType.Arms],
                [ComponentType.Top] = clothConfig.NakedClothSet.Components[ComponentType.Top],
                [ComponentType.Decals] = clothConfig.NakedClothSet.Components[ComponentType.Decals],
                [ComponentType.Torso] = clothConfig.NakedClothSet.Components[ComponentType.Torso],
            },
        }

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideLeftHand then
        local override = {Props = {[PropType.LeftHand] = {Clear = true}}}

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideRightHand then
        local override = {Props = {[PropType.RightHand] = {Clear = true}}}

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideBag then
        local override = {Components = {[ComponentType.Bag] = clothConfig.NakedClothSet.Components[ComponentType.Bag]}}

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HidePants then
        local override = {
            Components = {
                [ComponentType.Pants] = clothConfig.NakedClothSet.Components[ComponentType.Pants] or
                    clothConfig.NakedClothSet.Components[tostring(ComponentType.Pants)],
            },
        }

        clothSet = MergeClothSet(clothSet, override)
    end

    if clothConfig.Config.HideShoes then
        local override = {
            Components = {[ComponentType.Shoes] = clothConfig.NakedClothSet.Components[ComponentType.Shoes]},
        }

        clothSet = MergeClothSet(clothSet, override)
    end

    return clothSet
end

function ApplyPlayerClothSet(playerId, clothSet)
    local ped = GetPlayerPed(playerId)

    ApplyPedClothSet(ped, clothSet)
end

function ApplyPlayerClothConfig(playerId, clothConfig)
    local clothSet = ClothConfigComputeToClothSet(clothConfig)

    ApplyPlayerClothSet(playerId, clothSet)
end

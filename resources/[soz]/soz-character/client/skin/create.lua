local createCharacterMenu = MenuV:CreateMenu(nil, "", "menu_job_lspd", "soz", "create-character")

local function CreateGenderSlider(menu, playerId, skin)
    local genderOptions = {
        { label = "Homme", value = GetHashKey("mp_m_freemode_01") },
        { label = "Femme", value = GetHashKey("mp_f_freemode_01") },
    }
    local genderValue = 1;

    if skin.Model.Hash == GetHashKey("mp_f_freemode_01") then
        genderValue = 2
    end

    local genderSlider = menu:AddSlider({
        label = "Genre",
        value = genderValue,
        values = genderOptions
    })

    genderSlider:On("change", function(_, valueIndex)
        local option = genderOptions[valueIndex]
        skin.Model.Hash = option.value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return genderSlider
end

local function CreateFatherSlider(menu, playerId, skin)
    local fatherOptions = {
        { label = "Benjamin", value = 0, texture = "male_0" },
        { label = "Daniel", value = 1, texture = "male_1" },
        { label = "Joshua", value = 2, texture = "male_2" },
        { label = "Noah", value = 3, texture = "male_3" },
        { label = "Andrew", value = 4, texture = "male_4" },
        { label = "Joan", value = 5, texture = "male_5" },
        { label = "Alex", value = 6, texture = "male_6" },
        { label = "Isaac", value = 7, texture = "male_7" },
        { label = "Evan", value = 8, texture = "male_8" },
        { label = "Ethan", value = 9, texture = "male_9" },
        { label = "Vincent", value = 10, texture = "male_10" },
        { label = "Angel", value = 11, texture = "male_11" },
        { label = "Diego", value = 12, texture = "male_12" },
        { label = "Adrian", value = 13, texture = "male_13" },
        { label = "Gabriel", value = 14, texture = "male_14" },
        { label = "Michael", value = 15, texture = "male_15" },
        { label = "Santiago", value = 16, texture = "male_16" },
        { label = "Kevin", value = 17, texture = "male_17" },
        { label = "Louis", value = 18, texture = "male_18" },
        { label = "Samuel", value = 19, texture = "male_19" },
        { label = "Anthony", value = 20, texture = "male_20" },
        { label = "Claude", value = 42, texture = "special_male_0" },
        { label = "Niko", value = 43, texture = "special_male_1" },
        { label = "John", value = 44, texture = "special_male_2" },
    }

    local fatherValue = 1

    for i, v in ipairs(fatherOptions) do
        if v.value == skin.Model.Father then
            fatherValue = i

            break
        end
    end

    local fatherSlider = menu:AddSlider({
        label = "Père",
        value = fatherValue,
        values = fatherOptions
    })

    fatherSlider:On("change", function(_, value)
        local option = fatherOptions[value]
        skin.Model.Father = option.value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return fatherSlider
end

local function CreateMotherSlider(menu, playerId, skin)
    local motherOptions = {
        { label = "Hannah", value = 21, texture = "female_0" },
        { label = "Audrey", value = 22, texture = "female_1" },
        { label = "Jasmine", value = 23, texture = "female_2" },
        { label = "Giselle", value = 24, texture = "female_3" },
        { label = "Amelia", value = 25, texture = "female_4" },
        { label = "Isabella", value = 26, texture = "female_5" },
        { label = "Zoe", value = 27, texture = "female_6" },
        { label = "Ava", value = 28, texture = "female_7" },
        { label = "Camilla", value = 29, texture = "female_8" },
        { label = "Violet", value = 30, texture = "female_9" },
        { label = "Sophia", value = 31, texture = "female_10" },
        { label = "Eveline", value = 32, texture = "female_11" },
        { label = "Nicole", value = 33, texture = "female_12" },
        { label = "Ashley", value = 34, texture = "female_13" },
        { label = "Grace", value = 35, texture = "female_14" },
        { label = "Brianna", value = 36, texture = "female_15" },
        { label = "Natalie", value = 37, texture = "female_16" },
        { label = "Olivia", value = 38, texture = "female_17" },
        { label = "Elizabeth", value = 39, texture = "female_18" },
        { label = "Charlotte", value = 40, texture = "female_19" },
        { label = "Emma", value = 41, texture = "female_20" },
        { label = "Misty", value = 45, texture = "special_female_0" },
    }

    local motherValue = 1

    for i, v in ipairs(motherOptions) do
        if v.value == skin.Model.Mother then
            motherValue = i

            break
        end
    end

    local fatherSlider = menu:AddSlider({
        label = "Mère",
        value = motherValue,
        values = motherOptions
    })

    fatherSlider:On("change", function(_, value)
        local option = motherOptions[value]
        skin.Model.Mother = option.value
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return fatherSlider
end

local function OpenCreateCharacterMenu(skin)
    createCharacterMenu:ClearItems()

    local playerId = PlayerId()
    local modelMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Identité"})
    local bodyMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Physique"})
    local faceMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Soins"})
    local clothMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Vêtements"})

    CreateGenderSlider(modelMenu, playerId, skin)
    CreateFatherSlider(modelMenu, playerId, skin)
    CreateMotherSlider(modelMenu, playerId, skin)

    createCharacterMenu:AddButton({label = "Identité", value = modelMenu})
    createCharacterMenu:AddButton({label = "Physique", value = bodyMenu})
    createCharacterMenu:AddButton({label = "Soins", value = faceMenu})
    createCharacterMenu:AddButton({label = "Vêtements", value = clothMenu})

    createCharacterMenu:Open()
    createCharacterMenu:On("close", function()
        print("close")
    end)
end

function CreateCharacter()
    local skin = GetDefaultBodySkin()
    ApplyPlayerBodySkin(PlayerId(), skin)
    Camera.Activate()

    OpenCreateCharacterMenu(skin);

    --Camera.Deactivate()
end


function GetDefaultBodySkin()
    return {
        Model = {
            Hash = GetHashKey("mp_f_freemode_01"),
            Father = 0,
            Mother = 23,
            ShapeMix = 0.5,
            SkinMix = 0.5,
        },
        Hair = {
            HairType = 0,
            HairColor = 0,
            EyebrowType = -1,
            EyebrowColor = 0,
            BeardType = -1,
            BeardColor = 0,
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
            FullMakeupType = -1,
            FullMakeupDefaultColor = true,
            FullMakeupPrimaryColor = 0,
            FullMakeupSecondaryColor = 0,
        },
    }
end

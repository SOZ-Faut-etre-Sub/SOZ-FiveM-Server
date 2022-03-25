local function CreateGenderSlider(menu, playerId, skin, clothConfig)
    local genderOptions = {
        {label = "Homme", value = GetHashKey("mp_m_freemode_01")},
        {label = "Femme", value = GetHashKey("mp_f_freemode_01")},
    }
    local genderValue = 1;

    if skin.Model.Hash == GetHashKey("mp_f_freemode_01") then
        genderValue = 2
    end

    local genderSlider = menu:AddSlider({label = "Genre", value = genderValue, values = genderOptions})

    genderSlider:On("change", function(_, valueIndex)
        local option = genderOptions[valueIndex]
        skin.Model.Hash = option.value

        if option.value == GetHashKey("mp_f_freemode_01") then
            clothConfig.BaseClothSet = GetFemaleDefaultBaseClothSet()
            clothConfig.NakedClothSet = GetFemaleDefaultNakedClothSet()
        else
            clothConfig.BaseClothSet = GetMaleDefaultBaseClothSet()
            clothConfig.NakedClothSet = GetMaleDefaultNakedClothSet()
        end

        ApplyPlayerBodySkin(playerId, skin)
        ApplyPlayerClothConfig(playerId, clothConfig)
    end)

    return genderSlider
end

local function CreateFatherSlider(menu, heritage, playerId, skin)
    local fatherOptions = {
        {label = "Benjamin", value = 0, texture = "male_0"},
        {label = "Daniel", value = 1, texture = "male_1"},
        {label = "Joshua", value = 2, texture = "male_2"},
        {label = "Noah", value = 3, texture = "male_3"},
        {label = "Andrew", value = 4, texture = "male_4"},
        {label = "Joan", value = 5, texture = "male_5"},
        {label = "Alex", value = 6, texture = "male_6"},
        {label = "Isaac", value = 7, texture = "male_7"},
        {label = "Evan", value = 8, texture = "male_8"},
        {label = "Ethan", value = 9, texture = "male_9"},
        {label = "Vincent", value = 10, texture = "male_10"},
        {label = "Angel", value = 11, texture = "male_11"},
        {label = "Diego", value = 12, texture = "male_12"},
        {label = "Adrian", value = 13, texture = "male_13"},
        {label = "Gabriel", value = 14, texture = "male_14"},
        {label = "Michael", value = 15, texture = "male_15"},
        {label = "Santiago", value = 16, texture = "male_16"},
        {label = "Kevin", value = 17, texture = "male_17"},
        {label = "Louis", value = 18, texture = "male_18"},
        {label = "Samuel", value = 19, texture = "male_19"},
        {label = "Anthony", value = 20, texture = "male_20"},
        {label = "Claude", value = 42, texture = "special_male_0"},
        {label = "Niko", value = 43, texture = "special_male_1"},
        {label = "John", value = 44, texture = "special_male_2"},
    }

    local fatherValue = 1

    for i, v in ipairs(fatherOptions) do
        if v.value == skin.Model.Father then
            fatherValue = i
            heritage:SetPortraitMale(v.texture)

            break
        end
    end

    local fatherSlider = menu:AddSlider({label = "Père", value = fatherValue, values = fatherOptions})

    fatherSlider:On("change", function(_, value)
        local option = fatherOptions[value]
        skin.Model.Father = option.value
        heritage:SetPortraitMale(option.texture)
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return fatherSlider
end

local function CreateMotherSlider(menu, heritage, playerId, skin)
    local motherOptions = {
        {label = "Hannah", value = 21, texture = "female_0"},
        {label = "Audrey", value = 22, texture = "female_1"},
        {label = "Jasmine", value = 23, texture = "female_2"},
        {label = "Giselle", value = 24, texture = "female_3"},
        {label = "Amelia", value = 25, texture = "female_4"},
        {label = "Isabella", value = 26, texture = "female_5"},
        {label = "Zoe", value = 27, texture = "female_6"},
        {label = "Ava", value = 28, texture = "female_7"},
        {label = "Camilla", value = 29, texture = "female_8"},
        {label = "Violet", value = 30, texture = "female_9"},
        {label = "Sophia", value = 31, texture = "female_10"},
        {label = "Eveline", value = 32, texture = "female_11"},
        {label = "Nicole", value = 33, texture = "female_12"},
        {label = "Ashley", value = 34, texture = "female_13"},
        {label = "Grace", value = 35, texture = "female_14"},
        {label = "Brianna", value = 36, texture = "female_15"},
        {label = "Natalie", value = 37, texture = "female_16"},
        {label = "Olivia", value = 38, texture = "female_17"},
        {label = "Elizabeth", value = 39, texture = "female_18"},
        {label = "Charlotte", value = 40, texture = "female_19"},
        {label = "Emma", value = 41, texture = "female_20"},
        {label = "Misty", value = 45, texture = "special_female_0"},
    }

    local motherValue = 1

    for i, v in ipairs(motherOptions) do
        if v.value == skin.Model.Mother then
            motherValue = i
            heritage:SetPortraitFemale(v.texture)

            break
        end
    end

    local fatherSlider = menu:AddSlider({label = "Mère", value = motherValue, values = motherOptions})

    fatherSlider:On("change", function(_, value)
        local option = motherOptions[value]
        skin.Model.Mother = option.value
        heritage:SetPortraitFemale(option.texture)
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return fatherSlider
end

local function CreateModelMenuItems(modelMenu, playerId, skin, clothConfig)
    CreateGenderSlider(modelMenu, playerId, skin, clothConfig)

    local heritage = modelMenu:AddHeritage({portraitMale = "male_0", portraitFemale = "female_0"})
    CreateFatherSlider(modelMenu, heritage, playerId, skin)
    CreateMotherSlider(modelMenu, heritage, playerId, skin)

    modelMenu:AddRange({
        label = "Ressemblance",
        value = skin.Model.ShapeMix * 100,
        minLabel = "Père",
        maxLabel = "Mère",
        min = 0,
        max = 100,
        interval = 5,
    }):On("change", function(_, value)
        skin.Model.ShapeMix = value / 100
        ApplyPlayerBodySkin(playerId, skin)
    end)

    modelMenu:AddRange({
        label = "Couleur de peau",
        value = skin.Model.SkinMix * 100,
        minLabel = "Père",
        maxLabel = "Mère",
        min = 0,
        max = 100,
        interval = 5,
    }):On("change", function(_, value)
        skin.Model.SkinMix = value / 100
        ApplyPlayerBodySkin(playerId, skin)
    end)

    return modelMenu
end

function CreateModelMenu(createCharacterMenu, playerId, skin, clothConfig)
    local modelMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Identité"})

    -- Add heritage before open, to preload textures
    modelMenu:AddHeritage({portraitMale = "male_0", portraitFemale = "female_0"})
    modelMenu:ClearItems()

    modelMenu:On("open", function()
        CreateModelMenuItems(modelMenu, playerId, skin, clothConfig)
    end)

    modelMenu:On("close", function()
        modelMenu:ClearItems()
    end)

    return modelMenu
end

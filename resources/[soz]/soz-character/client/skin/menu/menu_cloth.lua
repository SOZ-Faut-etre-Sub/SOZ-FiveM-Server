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

local function CreateComponentItems(clothMenu, playerId, configComponent, clothSet)
    local drawableOptions = {}
    local drawableValue = 1

    for drawableIndex, drawable in ipairs(configComponent.Drawables) do
        drawableOptions[#drawableOptions + 1] = {value = drawableIndex, label = drawable.Name, drawable = drawable}

        if drawable.DrawableId == clothSet.Components[configComponent.ComponentId].Drawable then
            drawableValue = #drawableOptions
        end
    end

    clothMenu:AddTitle({label = configComponent.Name or ClothMenuLabel[configComponent.ComponentId]})

    local sliderDrawable = clothMenu:AddSlider({label = "Collection", value = drawableValue, values = drawableOptions})
    local sliderTexture = clothMenu:AddSlider({label = "Variation", value = 0, values = {}})
    local textureOptions = {}
    local textureValue = 1

    local UpdateTextureItems = function(drawableIndex)
        textureOptions = {}

        for textureIndex, texture in pairs(configComponent.Drawables[drawableIndex].Textures) do
            textureOptions[#textureOptions + 1] = {value = textureIndex, label = texture.Name, texture = texture}

            if texture.TextureId == clothSet.Components[configComponent.ComponentId].Texture then
                textureValue = #textureOptions
            end
        end

        sliderTexture:ClearValues()
        sliderTexture:AddValues(textureOptions)
        sliderTexture:SetValue(textureValue)

        return textureOptions
    end

    UpdateTextureItems(drawableOptions[drawableValue].value)

    sliderDrawable:On("change", function(_, value)
        local option = drawableOptions[value]
        local updatedTextureOptions = UpdateTextureItems(option.value)
        local newTextureValue = 0

        if #textureOptions > 0 then
            newTextureValue = updatedTextureOptions[1].texture.TextureId
        end

        clothSet.Components[configComponent.ComponentId] = {
            Drawable = option.drawable.DrawableId,
            Texture = newTextureValue,
        }
        ApplyPlayerClothSet(playerId, clothSet)
    end)

    sliderTexture:On("change", function(_, value)
        local option = textureOptions[value]

        clothSet.Components[configComponent.ComponentId].Texture = option.texture.TextureId
        ApplyPlayerClothSet(playerId, clothSet)
    end)
end

local function CreatePropItems(clothMenu, playerId, configProp, clothSet)
    local drawableOptions = {}
    local drawableValue = 1

    for drawableIndex, drawable in ipairs(configProp.Drawables) do
        drawableOptions[#drawableOptions + 1] = {value = drawableIndex, label = drawable.Name, drawable = drawable}

        if drawable.DrawableId == clothSet.Props[configProp.PropId].Drawable then
            drawableValue = #drawableOptions
        end
    end

    clothMenu:AddTitle({label = ClothMenuLabel[configProp.PropId]})

    local sliderDrawable = clothMenu:AddSlider({label = "Type", value = drawableValue, values = drawableOptions})
    local sliderTexture = clothMenu:AddSlider({label = "Texture", value = 0, values = {}})
    local textureOptions = {}
    local textureValue = 1

    local UpdateTextureItems = function(drawableIndex)
        textureOptions = {}

        for textureIndex, texture in pairs(configProp.Drawables[drawableIndex].Textures) do
            textureOptions[#textureOptions + 1] = {value = textureIndex, label = texture.Name, texture = texture}

            if texture.TextureId == clothSet.Props[configProp.PropId].Texture then
                textureValue = #textureOptions
            end
        end

        sliderTexture:ClearValues()
        sliderTexture:AddValues(textureOptions)
        sliderTexture:SetValue(textureValue)

        return textureOptions
    end

    UpdateTextureItems(drawableOptions[drawableValue].value)

    sliderDrawable:On("change", function(_, value)
        local option = drawableOptions[value]
        local updatedTextureOptions = UpdateTextureItems(option.value)
        local newTextureValue = 0

        if #textureOptions > 0 then
            newTextureValue = updatedTextureOptions[1].texture.TextureId
        end

        clothSet.Props[configProp.PropId] = {Drawable = option.drawable.DrawableId, Texture = newTextureValue}
        ApplyPlayerClothSet(playerId, clothSet)
    end)

    sliderTexture:On("change", function(_, value)
        local option = textureOptions[value]

        clothSet.Props[configProp.PropId].Texture = option.texture.TextureId
        ApplyPlayerClothSet(playerId, clothSet)
    end)
end

local function CreateClothMenuItems(clothMenu, playerId, config, clothConfig, clothSetKey)
    local configModel = config.Male
    local clothSet = Clone(clothConfig[clothSetKey])

    if GetEntityModel(GetPlayerPed(playerId)) == GetHashKey("mp_f_freemode_01") then
        configModel = config.Female
    end

    for _, configComponent in ipairs(configModel.Components) do
        CreateComponentItems(clothMenu, playerId, configComponent, clothSet)
    end

    for _, configProp in ipairs(configModel.Props) do
        CreatePropItems(clothMenu, playerId, configProp, clothSet)
    end

    return clothSet
end

function CreateClothMenu(createCharacterMenu, playerId, clothShopConfig, clothConfig, clothSetKey)
    local clothMenu = MenuV:InheritMenu(createCharacterMenu, {subtitle = "Vêtements"})

    -- Only display cloth set, override cloth config, so we can choose base clothing even if naked or wearing job cloth
    local clothSet = clothConfig[clothSetKey]
    ApplyPlayerClothSet(playerId, clothSet)

    clothMenu:On("open", function()
        clothSet = CreateClothMenuItems(clothMenu, playerId, clothShopConfig, clothConfig, clothSetKey)
    end)

    clothMenu:On("close", function()
        clothConfig[clothSetKey] = clothSet
        ApplyPlayerClothConfig(playerId, clothConfig)

        clothMenu:ClearItems()
    end)

    return clothMenu
end

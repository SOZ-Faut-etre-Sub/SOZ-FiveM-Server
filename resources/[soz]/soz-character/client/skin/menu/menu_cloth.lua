local function CreateCategoryUniqueCollectionItems(clothMenu, playerId, collection, clothSet)
    local itemOptions = {}

    for itemIndex, item in pairs(collection.Items) do
        itemOptions[#itemOptions + 1] = {value = itemIndex, label = item.Name, item = item}
    end

    local sliderItems = clothMenu:AddSlider({label = collection.Name, value = 0, values = itemOptions})

    sliderItems:On("change", function(_, value)
        local option = itemOptions[value]

        MergeClothSet(clothSet, {Components = option.item.ApplyComponents or {}, Props = option.item.ApplyProps or {}})

        ApplyPlayerClothSet(playerId, clothSet)
    end)
end

local function CreateCategoryMultipleCollectionItems(clothMenu, playerId, collections, clothSet)
    local collectionOptions = {}
    local itemOptions = {}

    for collectionIndex, collection in pairs(collections) do
        collectionOptions[#collectionOptions + 1] = {
            value = collectionIndex,
            label = collection.Name,
            collection = collection,
        }
    end

    local sliderCollection = clothMenu:AddSlider({label = "Collection", value = 1, values = collectionOptions})
    local sliderItems = clothMenu:AddSlider({label = "Elements", value = 0, values = {}})

    local UpdateItems = function(collectionIndex)
        itemOptions = {}

        for itemIndex, item in pairs(collections[collectionIndex].Items) do
            itemOptions[#itemOptions + 1] = {value = itemIndex, label = item.Name, item = item}
        end

        sliderItems:ClearValues()
        sliderItems:AddValues(itemOptions)
        sliderItems:SetValue(1)

        return itemOptions
    end

    UpdateItems(collectionOptions[1].value)

    sliderCollection:On("change", function(_, value)
        local option = collectionOptions[value]
        local updatedTextureOptions = UpdateItems(option.value)

        if #updatedTextureOptions > 0 then
            local newItem = updatedTextureOptions[1].item or {}

            MergeClothSet(clothSet, {Components = newItem.ApplyComponents or {}, Props = newItem.ApplyProps or {}})

            ApplyPlayerClothSet(playerId, clothSet)
        end
    end)

    sliderItems:On("change", function(_, value)
        local option = itemOptions[value]

        MergeClothSet(clothSet, {Components = option.item.ApplyComponents or {}, Props = option.item.ApplyProps or {}})

        ApplyPlayerClothSet(playerId, clothSet)
    end)
end

local function CreateCategoryItems(clothMenu, playerId, category, clothSet)
    if #category.Collections == 0 then
        return
    end

    if category.Name ~= nil and category.Name ~= "" then
        clothMenu:AddTitle({label = category.Name})
    end

    if #category.Collections == 1 then
        return CreateCategoryUniqueCollectionItems(clothMenu, playerId, category.Collections[1], clothSet)
    end

    return CreateCategoryMultipleCollectionItems(clothMenu, playerId, category.Collections, clothSet)
end

local function CreateClothMenuItems(clothMenu, playerId, shopConfig, clothConfig, clothSetKey)
    local clothSet = Clone(clothConfig[clothSetKey])
    local modelHash = GetEntityModel(GetPlayerPed(playerId))
    local configModel = shopConfig[modelHash] or nil

    if configModel == nil then
        exports["soz-monitor"]:Log("ERROR", "Opening cloth menu with unsupported model hash: " .. modelHash)

        return clothSet
    end

    for _, category in ipairs(configModel) do
        CreateCategoryItems(clothMenu, playerId, category, clothSet)
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

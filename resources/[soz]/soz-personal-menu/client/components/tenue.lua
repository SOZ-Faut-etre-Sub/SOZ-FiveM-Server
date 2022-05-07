local BaseClothSet, NakedClothSet
local components = {
    [1] = {label = "Chapeau", componentId = 0, value = "HideHead"},
    [2] = {label = "Masque", componentId = 1, value = "HideMask"},
    [3] = {label = "Lunettes", propId = 1, value = "HideGlasses"},
    [4] = {label = "Oreilles", propId = 2, value = "HideEar"},
    [5] = {label = "Chaine", componentId = 7, value = "HideChain"},
    [6] = {label = "Gilet", componentId = 9, value = "HideBulletproof"},
    [7] = {label = "Haut", componentId = {3, 8, 10, 11}, value = "HideTop"},
    [8] = {label = "Montre", propId = 6, value = "HideLeftHand"},
    [9] = {label = "Bracelet", propId = 7, value = "HideRightHand"},
    [10] = {label = "Sac", componentId = 5, value = "HideBag"},
    [11] = {label = "Pantalon", componentId = 4, value = "HidePants"},
    [12] = {label = "Chaussures", componentId = 6, value = "HideShoes"},
}

local function componentEquipped(player, componentId)
    if componentId == nil then
        return false
    end

    if type(componentId) == "table" then
        local found = false

        for _, id in ipairs(componentId) do
            found = found or componentEquipped(player, id)
        end

        return found
    end

    if NakedClothSet.Components[componentId] == nil then
        return false
    end

    return GetPedDrawableVariation(player, componentId) ~= NakedClothSet.Components[componentId].Drawable or GetPedTextureVariation(player, componentId) ~=
               NakedClothSet.Components[componentId].Texture or GetPedPaletteVariation(player, componentId) ~= NakedClothSet.Components[componentId].Palette
end

local function propEquipped(player, propId)
    if propId == nil then
        return false
    end

    if NakedClothSet.Props[propId] == nil then
        NakedClothSet.Props[propId] = {Drawable = -1, Texture = -1}
    end

    return GetPedPropIndex(player, propId) ~= NakedClothSet.Props[propId].Drawable or GetPedPropTextureIndex(player, propId) ~=
               NakedClothSet.Props[propId].Texture
end

function TenueEntry(menu)
    local componentsMenu = MenuV:InheritMenu(menu, {subtitle = "Gestion de la tenue"})
    local ped = PlayerPedId()
    if PlayerData.skin.Model.Hash == GetHashKey("mp_m_freemode_01") then
        BaseClothSet = GetMaleDefaultBaseClothSet()
        NakedClothSet = GetMaleDefaultNakedClothSet()
    else
        BaseClothSet = GetFemaleDefaultBaseClothSet()
        NakedClothSet = GetFemaleDefaultNakedClothSet()
    end

    for _, component in ipairs(components) do
        componentsMenu:AddCheckbox({
            label = component.label,
            value = componentEquipped(ped, component.componentId) or propEquipped(ped, component.propId),
            change = function(_, value)
                QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                    disableMovement = true,
                    disableCombat = true,
                }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                    TriggerServerEvent("soz-character:server:UpdateClothConfig", component.value, not value)
                end)
            end,
        })
    end

    menu:AddButton({label = "Gestion de la tenue", value = componentsMenu})
end

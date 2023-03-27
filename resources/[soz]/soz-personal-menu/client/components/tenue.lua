local function PlayHelmetAnim(value)
    QBCore.Functions.RequestAnimDict("veh@common@fp_helmet@")
    if value then
        TaskPlayAnim(PlayerPedId(), "veh@common@fp_helmet@", "put_on_helmet", 8.0, -8.0, 2000, 16, 0, 0, 0, 0)
    else
        TaskPlayAnim(PlayerPedId(), "veh@common@fp_helmet@", "take_off_helmet_stand", 8.0, -8.0, 2000, 16, 0, 0, 0, 0)
    end
    Wait(1100)
end

local function PlayComponentAnim(value)
    QBCore.Functions.RequestAnimDict("anim@mp_yacht@shower@male@")
    TaskPlayAnim(PlayerPedId(), "anim@mp_yacht@shower@male@", "male_shower_towel_dry_to_get_dressed", 8.0, -8.0, 3000, 16, 0, 0, 0, 0)
    Wait(3000)
end

local function PlayPropsAnim(value)
    QBCore.Functions.RequestAnimDict("mp_masks@on_foot")
    TaskPlayAnim(PlayerPedId(), "mp_masks@on_foot", "put_on_mask", 8.0, -8.0, 2000, 16, 0, 0, 0, 0)
    Wait(800)
end

local components = {
    [1] = {label = "Casque", anim = PlayHelmetAnim, value = "ShowHelmet", inverted = true},
    [2] = {label = "Chapeau", anim = PlayPropsAnim, value = "HideHead"},
    [3] = {label = "Masque", anim = PlayComponentAnim, value = "HideMask"},
    [4] = {label = "Lunettes", anim = PlayPropsAnim, value = "HideGlasses"},
    [5] = {label = "Boucles", anim = PlayPropsAnim, value = "HideEar"},
    [6] = {label = "Collier", anim = PlayComponentAnim, value = "HideChain"},
    [7] = {label = "Gilet", anim = PlayComponentAnim, value = "HideBulletproof"},
    [8] = {label = "Haut", anim = PlayComponentAnim, value = "HideTop"},
    [9] = {label = "Montre", anim = PlayPropsAnim, value = "HideLeftHand"},
    [10] = {label = "Bracelet", anim = PlayPropsAnim, value = "HideRightHand"},
    [11] = {label = "Sac", anim = PlayComponentAnim, value = "HideBag"},
    [12] = {label = "Pantalon", anim = PlayComponentAnim, value = "HidePants"},
    [13] = {label = "Chaussures", anim = PlayComponentAnim, value = "HideShoes"},
}

function TenueEntry(menu)
    local componentsMenu = MenuV:InheritMenu(menu, {subtitle = "Gestion de la tenue"})
    local ped = PlayerPedId()
    PlayerHasHelmet = PlayerData.cloth_config.Config.ShowHelmet

    for k, component in ipairs(components) do
        local value = not PlayerData.cloth_config.Config[component.value]
        if component.inverted then
            value = PlayerData.cloth_config.Config[component.value]
        end
        componentsMenu:AddCheckbox({
            label = component.label,
            value = value,
            change = function(_, value)
                if LocalPlayer.state["is_in_hub"] then
                    return
                end

                FreezeEntityPosition(PlayerPedId(), true)
                component.anim(value)
                FreezeEntityPosition(PlayerPedId(), false)
                local sendvalue = not value
                if component.inverted then
                    sendvalue = value
                end
                TriggerServerEvent("soz-character:server:UpdateClothConfig", component.value, sendvalue)
            end,
        })
    end

    menu:AddButton({label = "Gestion de la tenue", value = componentsMenu})
end

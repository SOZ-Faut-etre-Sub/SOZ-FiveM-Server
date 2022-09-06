local animationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})
local allAnimationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})
local allWalksMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Démarches"})
local allMoodsMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Humeurs"})
local personalAnimationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})

local animationCatalogMenu, walkCatalogMenu = {}, {}
local favoriteAnimationRegister, favoriteAnimationKey = false, 1

local prop_net = nil
local prop2_net = nil

function cleanProps()
    if prop_net then
        DetachEntity(prop_net, 0, 0)
        DeleteEntity(prop_net)
        prop_net = nil
    end
    if prop2_net then
        DetachEntity(prop2_net, 0, 0)
        DeleteEntity(prop2_net)
        prop2_net = nil
    end
end
RegisterNetEvent("soz-personal-menu:cleanProps", function()
    cleanProps()
end)

-- animation parameters:
-- [1] = 0 if scenario, the dict name otherwise
-- [2] = anim name
-- [3] = flag (see https://wiki.rage.mp/index.php?title=Player::taskPlayAnim) only for animation and not scenario
-- [4] = boolean for the loop (TODO: Remove this flag and use the third argument instead)
-- [5] = never used
-- [6] = used for arrestation animation only
-- [7] = Prop 1 configuration
-- [8] = Prop 2 configuration
local PlayEmote = function(animation)
    local ped = PlayerPedId()

    if IsNuiFocused() or IsPedSittingInAnyVehicle(ped) or LocalPlayer.state.isEscorted or LocalPlayer.state.isEscorting or PlayerData.metadata["isdead"] or
        PlayerData.metadata["ishandcuffed"] or PlayerData.metadata["inlaststand"] or exports["progressbar"]:IsDoingAction() then
        return
    end

    if animation.event then
        TriggerEvent(animation.event)
        return
    end

    if animation[1] ~= "0" then
        QBCore.Functions.RequestAnimDict(animation[1])
        local lockPosition = false
        local flag = animation[3]
        if animation[4] == true then
            flag = 1
        end
        if IsEntityPlayingAnim(ped, animation[1], animation[2], 3) then
            StopAnimTask(ped, animation[1], animation[2], 1.0)
        else
            TaskPlayAnim(ped, animation[1], animation[2], 8.0, -8.0, -1, flag, 0, lockPosition, lockPosition, lockPosition)

            if animation[6] then
                local animDuration = GetAnimDuration(animation[1], animation[2])
                Wait(animDuration * 1000)
                TaskPlayAnim(ped, animation[1], animation[6], 8.0, -8.0, -1, flag, 0, lockPosition, lockPosition, lockPosition)
            end

            if animation[7] then
                RequestModel(animation[7].model)

                while not HasModelLoaded(GetHashKey(animation[7].model)) do
                    Wait(1)
                end
                local pCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.0, 0.0)
                local modelSpawn = CreateObject(GetHashKey(animation[7].model), pCoords.x, pCoords.y, pCoords.z, true, true, true)
                -- local objectNetId = ObjToNet(modelSpawn)
                -- SetNetworkIdCanMigrate(objectNetId, false)

                AttachEntityToEntity(modelSpawn, ped, GetPedBoneIndex(ped, animation[7].bone), animation[7].coords[1], animation[7].coords[2],
                                     animation[7].coords[3], animation[7].coords[4], animation[7].coords[5], animation[7].coords[6], true, true, false, true, 0,
                                     true)
                prop_net = modelSpawn
                SetModelAsNoLongerNeeded(animation[7].model)
            end

            if animation[8] then
                RequestModel(animation[8].model)

                while not HasModelLoaded(GetHashKey(animation[8].model)) do
                    Wait(1)
                end
                local pCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.0, 0.0)
                local modelSpawn = CreateObject(GetHashKey(animation[8].model), pCoords.x, pCoords.y, pCoords.z, true, true, true)
                -- local objectNetId = ObjToNet(modelSpawn)
                -- SetNetworkIdCanMigrate(objectNetId, false)

                AttachEntityToEntity(modelSpawn, ped, GetPedBoneIndex(ped, animation[8].bone), animation[8].coords[1], animation[8].coords[2],
                                     animation[8].coords[3], animation[8].coords[4], animation[8].coords[5], animation[8].coords[6], true, true, false, true, 0,
                                     true)
                prop2_net = modelSpawn
                SetModelAsNoLongerNeeded(animation[8].model)
            end
        end
    else
        if IsPedUsingScenario(ped, animation[2]) then
            ClearPedTasks(ped)
            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
        else
            TaskStartScenarioInPlace(ped, animation[2], -1, true)
        end
    end
end

local PlayWalking = function(animation)
    RequestAnimSet(animation)
    while not HasAnimSetLoaded(animation) do
        Wait(1)
    end

    SetPedMovementClipset(PlayerPedId(), animation, 0.2)
    RemoveAnimSet(animation)
end

local forceApplyWalkStyle = function()
    ResetPedMovementClipset(PlayerPedId())
    Wait(1000)
    local walk = PlayerData.metadata.walk

    if walk then
        PlayWalking(walk)
    end
end

GenerateAnimationList = function(menu, category, content)
    if type(category) ~= "number" then
        local categoryID = menu.UUID .. category
        if animationCatalogMenu[categoryID] == nil then
            animationCatalogMenu[categoryID] = MenuV:InheritMenu(menu, {subtitle = category})
            menu:AddButton({icon = "📋", label = category, value = animationCatalogMenu[categoryID]})
        end

        for cat, cont in pairs(content) do
            GenerateAnimationList(animationCatalogMenu[categoryID], cat, cont)
        end
        return
    end

    menu:AddButton({
        label = content[1],
        rightLabel = content[3] or nil,
        icon = content[6] or nil,
        select = function()
            if favoriteAnimationRegister then
                SetResourceKvp("soz/animation/" .. favoriteAnimationKey, json.encode({
                    label = content[1],
                    anim = content[5],
                }))
                favoriteAnimationRegister = false

                MenuV:CloseAll(function()
                    personalAnimationMenu:Close()
                    animationMenu:Close()
                end)
            else
                PlayEmote(content[5])
            end
        end,
    })

    Wait(5)
end

GenerateWalksList = function(menu, category, content)
    if type(category) ~= "number" then
        local categoryID = menu.UUID .. category
        if walkCatalogMenu[categoryID] == nil then
            walkCatalogMenu[categoryID] = MenuV:InheritMenu(menu, {subtitle = category})
            menu:AddButton({icon = "📋", label = category, value = walkCatalogMenu[categoryID]})
        end

        for cat, cont in pairs(content) do
            GenerateWalksList(walkCatalogMenu[categoryID], cat, cont)
        end
        return
    end

    menu:AddButton({
        label = content.name,
        select = function()
            PlayWalking(content.walk)
            TriggerServerEvent("QBCore:Server:SetMetaData", "walk", content.walk)
        end,
    })

    Wait(5)
end

GenerateMoodList = function(menu, label, mood)
    menu:AddButton({
        label = label,
        select = function()
            SetFacialIdleAnimOverride(PlayerPedId(), mood)
            TriggerServerEvent("QBCore:Server:SetMetaData", "mood", mood)
        end,
    })
end

function AnimationsEntry()
    personalMenu:AddButton({label = "Animations", value = animationMenu})

    personalAnimationMenu:ClearItems()
    for shortcut = 1, 10 do
        shortcut = string.format("%02d", shortcut)
        local animation = GetResourceKvpString("soz/animation/" .. shortcut)
        personalAnimationMenu:AddSlider({
            label = "Animation personnelles " .. shortcut,
            value = nil,
            values = {{label = "Changer", value = "change"}, {label = "Supprimer", value = "delete"}},
            description = animation and json.decode(animation).label or "Aucune",
            select = function(_, value)
                if value == "change" then
                    favoriteAnimationRegister = true
                    favoriteAnimationKey = shortcut
                    allAnimationMenu:Open()
                elseif value == "delete" then
                    DeleteResourceKvp("soz/animation/" .. shortcut)
                    MenuV:CloseAll(function()
                        personalAnimationMenu:Close()
                        animationMenu:Close()
                    end)
                end
            end,
        })
    end
end

CreateThread(function()
    animationMenu:AddButton({label = "Animations", value = allAnimationMenu})
    animationMenu:AddButton({label = "Démarches", value = allWalksMenu})
    animationMenu:AddButton({label = "Humeurs", value = allMoodsMenu})
    animationMenu:AddButton({label = "Mes Animations", value = personalAnimationMenu})

    --- Walk style menu
    allWalksMenu:AddButton({
        label = "Démarche par défaut",
        select = function()
            ResetPedMovementClipset(PlayerPedId())
            TriggerServerEvent("QBCore:Server:SetMetaData", "walk", "")
        end,
    })
    for category, content in pairs(Config.WalkStyle) do
        GenerateWalksList(allWalksMenu, category, content)
    end

    --- Animation menu
    allAnimationMenu:AddButton({
        icon = "🛑",
        label = "Arrêter l'animation",
        value = nil,
        select = function()
            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
            ClearPedTasks(PlayerPedId())
            cleanProps()
        end,
    })
    for category, content in pairs(Config.AnimationsList) do
        GenerateAnimationList(allAnimationMenu, category, content)
    end

    allMoodsMenu:AddButton({
        label = "Humeur par défaut",
        select = function()
            SetFacialIdleAnimOverride(PlayerPedId(), "mood_normal_1")
            TriggerServerEvent("QBCore:Server:SetMetaData", "mood", "")
        end,
    })
    for _, value in pairs(Config.MoodsList) do
        GenerateMoodList(allMoodsMenu, value.label, value.anim)
    end
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    local walk = QBCore.Functions.GetPlayerData().metadata.walk

    if walk then
        PlayWalking(walk)
    end

    local mood = QBCore.Functions.GetPlayerData().metadata.mood
    if mood then
        SetFacialIdleAnimOverride(PlayerPedId(), mood, 0)
    end
end)

RegisterNetEvent("soz_ems:client:Revive", function()
    forceApplyWalkStyle()
end)

RegisterNetEvent("personal:client:ApplyWalkStyle", function()
    forceApplyWalkStyle()
end)

Citizen.CreateThread(function()
    for shortcut = 1, 10 do
        shortcut = string.format("%02d", shortcut)

        RegisterKeyMapping("animation_shortcut_" .. shortcut, "Lancer l'animation personnalisée " .. shortcut, "keyboard", "")
        RegisterCommand("animation_shortcut_" .. shortcut, function(source, args, rawCommand)
            if IsPedOnFoot(PlayerPedId()) then
                local kvpValue = GetResourceKvpString("soz/animation/" .. shortcut)
                if kvpValue then
                    local animation = json.decode(kvpValue)
                    PlayEmote(animation.anim)
                end
            end
        end, true)
    end
end)

local animationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})
local allAnimationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})
local allWalksMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Démarches"})
local personalAnimationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})

local animationCatalogMenu, walkCatalogMenu = {}, {}
local favoriteAnimationRegister, favoriteAnimationKey = false, 1

local PlayEmote = function(animation)
    local ped = PlayerPedId()

    if IsNuiFocused() or IsPedSittingInAnyVehicle(ped) or LocalPlayer.state.isEscorted or LocalPlayer.state.isEscorting or PlayerData.metadata["isdead"] or
        PlayerData.metadata["ishandcuffed"] or PlayerData.metadata["inlaststand"] then
        return
    end

    if animation[1] ~= "0" then
        QBCore.Functions.RequestAnimDict(animation[1])
        local canMove = animation[4] or false
        if IsEntityPlayingAnim(ped, animation[1], animation[2], 3) then
            StopAnimTask(ped, animation[1], animation[2], 1.0)
        else
            TaskPlayAnim(ped, animation[1], animation[2], 8.0, -8.0, -1, animation[3], 0, canMove, canMove, canMove)

            if animation[6] then
                local animDuration = GetAnimDuration(animation[1], animation[2])
                Wait(animDuration * 1000)
                TaskPlayAnim(ped, animation[1], animation[6], 8.0, -8.0, -1, animation[3], 0, canMove, canMove, canMove)
            end
        end
    else
        if IsPedUsingScenario(ped, animation[2]) then
            ClearPedTasks(ped)
        else
            TaskStartScenarioInPlace(ped, animation[2], 0, true)
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
            ClearPedTasks(PlayerPedId())
        end,
    })
    for category, content in pairs(Config.AnimationsList) do
        GenerateAnimationList(allAnimationMenu, category, content)
    end
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    local walk = QBCore.Functions.GetPlayerData().metadata.walk

    if walk then
        PlayWalking(walk)
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

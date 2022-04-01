local animationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})
local allAnimationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})
local personalAnimationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})

local animationCatalogMenu = {}
local favoriteAnimationRegister, favoriteAnimationKey = false, 1

local PlayEmote = function(animation)
    local ped = PlayerPedId()
    if not IsPedSittingInAnyVehicle(ped) then
        if animation[1] ~= "0" then
            QBCore.Functions.RequestAnimDict(animation[1])
            local canMove = animation[4] or false
            TaskPlayAnim(ped, animation[1], animation[2], 8.0, -8.0, -1, animation[3], 0, canMove, canMove, canMove)
        else
            TaskStartScenarioInPlace(ped, animation[2], 0, true)
        end
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
        -- description = content[2],
        rightLabel = content[3] or nil,
        -- content[4],
        select = function()
            if favoriteAnimationRegister then
                SetResourceKvp("soz/animation/" .. favoriteAnimationKey, json.encode(content[5]))
                favoriteAnimationRegister = false

                personalAnimationMenu:Close()
                animationMenu:Close()
            else
                PlayEmote(content[5])
            end
        end,
    })

    Wait(5)
end

function AnimationsEntry()
    personalMenu:AddButton({label = "Animations", value = animationMenu})
end

CreateThread(function()
    animationMenu:AddButton({label = "Toutes les animations", value = allAnimationMenu})
    animationMenu:AddButton({label = "Mes animations personnelles", value = personalAnimationMenu})

    for shortcut = 1, 10 do
        personalAnimationMenu:AddButton({
            label = "Animation personnelles " .. shortcut,
            value = animationMenu,
            select = function()
                favoriteAnimationRegister = true
                favoriteAnimationKey = shortcut
            end,
        })

        RegisterKeyMapping("animation_shortcut_" .. shortcut, "Lancer l'animation personnalisée " .. shortcut, "keyboard", "")
        RegisterCommand("animation_shortcut_" .. shortcut, function(source, args, rawCommand)
            if IsPedOnFoot(PlayerPedId()) then
                local kvpValue = GetResourceKvpString("soz/animation/" .. shortcut)
                if kvpValue then
                    PlayEmote(json.decode(kvpValue))
                end
            end
        end, true)
    end

    for category, content in pairs(Config.AnimationsList) do
        GenerateAnimationList(allAnimationMenu, category, content)
    end
end)

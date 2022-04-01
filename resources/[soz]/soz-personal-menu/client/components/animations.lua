local animationMenu = MenuV:InheritMenu(personalMenu, {subtitle = "Animations"})
local animationCatalog = {}

--- @param menu Menu
GenerateAnimationList = function(menu, category, content)
    if type(category) ~= "number" then
        local categoryID = menu.UUID .. category

        if animationCatalog[categoryID] == nil then
            animationCatalog[categoryID] = MenuV:InheritMenu(menu, {subtitle = category})
            menu:AddButton({icon = "📋", label = category, value = animationCatalog[categoryID]})
        end

        for cat, cont in pairs(content) do
            GenerateAnimationList(animationCatalog[categoryID], cat, cont)
        end

        return
    end

    menu:AddButton({
        label = content[1],
        -- description = content[2],
        rightLabel = content[3] or nil,
        -- content[4],
        select = function()
            local ped = PlayerPedId()
            local animation = content[5]

            if animation[1] ~= "0" then
                QBCore.Functions.RequestAnimDict(animation[1])
                TaskPlayAnim(ped, animation[1], animation[2], 8.0, -8.0, -1, animation[3], 0, animation[3] or false, animation[3] or false,
                             animation[3] or false)
            else
                TaskStartScenarioInPlace(ped, animation[2], 0, true)
            end

        end,
    })

    Wait(5)
end

function AnimationsEntry()
    personalMenu:AddButton({label = "Animations", value = animationMenu})
end

CreateThread(function()
    for category, content in pairs(Config.AnimationsList) do
        GenerateAnimationList(animationMenu, category, content)
    end
end)

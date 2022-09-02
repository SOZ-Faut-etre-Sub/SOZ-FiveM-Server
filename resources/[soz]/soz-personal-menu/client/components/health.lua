local healthSubMenu

function GenerateHealthMenu(healthSubmenu)
    --- HIDE BUTTON
    healthSubmenu:AddButton({
        label = "Faire des pompes",
        value = nil,
        select = function()
            menu:Close()
            TriggerEvent("soz-core:client:player:health:push-up")
        end,
    })

    healthSubmenu:AddButton({
        label = "Faire des abdos",
        value = nil,
        select = function()
            menu:Close()
            TriggerEvent("soz-core:client:player:health:sit-up")
        end,
    })
end

function HealthEntry(menu)
    healthSubMenu = MenuV:InheritMenu(menu, {subtitle = "Santé et Sport"})

    menu:AddButton({
        label = "Santé et Sport",
        value = healthSubMenu,
        description = "Gérer mon corps",
    })

    GenerateHealthMenu(healthSubMenu)
end

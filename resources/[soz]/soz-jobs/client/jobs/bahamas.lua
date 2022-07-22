BahamasJob = {}
BahamasJob.Functions = {}
-- TODO: Replace texture with menu_job_bahamas
BahamasJob.Menu = MenuV:CreateMenu(nil, "", "default", "soz", "bahamas:menu")
BahamasJob.HarvestZones = {}
BahamasJob.Workplaces = {}

CreateThread(function ()
    QBCore.Functions.CreateBlip("jobs:bahamas", {
        name = BahamasConfig.Blip.Name,
        coords = BahamasConfig.Blip.Coords,
        sprite = BahamasConfig.Blip.Icon,
        scale = BahamasConfig.Blip.Scale,
        color = BahamasConfig.Blip.Color
    })
end)

RegisterNetEvent("jobs:client:bahamas:OpenSocietyMenu", function ()
    if BahamasJob.Menu.IsOpen then
        return
    end
    BahamasJob.Menu:ClearItems()

    -- RECIPES
    local recipesMenu = MenuV:InheritMenu(BahamasJob.Menu, { subtitle = "Livre des recettes"})
    for cocktailId, ingredients in pairs(BahamasConfig.Recipes) do
        local cocktail = QBCore.Shared.Items[cocktailId]
        local subtitle = "Ingrédients pour " .. cocktail.label
        local ingredientsMenu = MenuV:InheritMenu(recipesMenu, { subtitle = subtitle })
        local canCraft = true

        for itemId, quantity in pairs(ingredients) do
            local item = QBCore.Shared.Items[itemId]
            local hasTheRequiredQuantity = QBCore.Functions.TriggerRpc("inventory:server:Search", PlayerData.source, "amount", itemId, nil) >= quantity
            if not hasTheRequiredQuantity then
                canCraft = false
            end

            local suffixLabel = ''
            if quantity > 1 then
                suffixLabel = 's'
            end

            ingredientsMenu:AddCheckbox({
                icon = item.icon or ("https://nui-img/soz-items/" .. item.name),
                label = quantity .. " " .. item.label .. suffixLabel,
                description = quantity,
                value = hasTheRequiredQuantity,
                disabled = true,
            })
        end

        -- TODO: Add condition to only display this option when in zone to craft
        ingredientsMenu:AddButton({
            label = "Fabriquer le cocktail",
            value = cocktailId,
            event = "soz-jobs:server:bahamas:craft-item",
            disabled = not canCraft,
        })

        recipesMenu:AddButton({
            label = cocktail.label,
            description = cocktail.description,
            icon = cocktail.icon or ("https://nui-img/soz-items/" .. cocktail.name),
            value = ingredientsMenu
        })
    end
    BahamasJob.Menu:AddButton({icon = "🍸", label = "Livre des recettes", value = recipesMenu})

    BahamasJob.Menu:Open()
end)

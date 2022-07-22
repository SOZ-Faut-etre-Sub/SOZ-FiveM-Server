BahamasJob = {}
BahamasJob.Functions = {}
-- TODO: Replace texture with menu_job_bahamas
BahamasJob.Menu = MenuV:CreateMenu(nil, "", "default", "soz", "bahamas:menu")
BahamasJob.HarvestZones = {}
BahamasJob.Workplaces = {}

CreateThread(function()
    QBCore.Functions.CreateBlip("jobs:bahamas", {
        name = BahamasConfig.Blip.Name,
        coords = BahamasConfig.Blip.Coords,
        sprite = BahamasConfig.Blip.Icon,
        scale = BahamasConfig.Blip.Scale,
        color = BahamasConfig.Blip.Color
    })
end)

AddEventHandler("jobs:client:bahamas:OpenSocietyMenu", function()
    if BahamasJob.Menu.IsOpen then
        return
    end
    BahamasJob.Menu:ClearItems()

    -- RECIPES
    local recipesMenu = MenuV:InheritMenu(BahamasJob.Menu, { subtitle = "Livre des recettes" })
    for cocktailId, ingredients in pairs(BahamasConfig.Recipes) do
        local cocktail = QBCore.Shared.Items[cocktailId]
        local subtitle = "Ingrédients pour " .. cocktail.label
        local ingredientsMenu = MenuV:InheritMenu(recipesMenu, { subtitle = subtitle })
        local canCraft = true

        for _, ingredient in pairs(ingredients) do
            local item = QBCore.Shared.Items[ingredient.itemId]
            local hasTheRequiredQuantity = QBCore.Functions.TriggerRpc("inventory:server:Search", QBCore.Functions.GetPlayerData(), "amount", ingredient.itemId, nil) >= ingredient.quantity
            if not hasTheRequiredQuantity then
                canCraft = false
            end

            local suffixLabel = ''
            if ingredient.quantity > 1 then
                suffixLabel = 's'
            end

            ingredientsMenu:AddCheckbox({
                label = ingredient.quantity .. " " .. item.label .. suffixLabel,
                description = item.description,
                value = hasTheRequiredQuantity,
                disabled = true,
            })
        end

        -- TODO: Add condition to only display this option when in zone to craft
        ingredientsMenu:AddButton({
            label = "Fabriquer le cocktail",
            disabled = not canCraft,
            select = function()
                local item = QBCore.Shared.Items[cocktailId]
                QBCore.Functions.Progressbar(
                    "food-craft-item", string.format("Vous préparez 1 %s", item.label),
                    BahamasConfig.Durations.Crafting, false, true, {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "anim@amb@nightclub@mini@drinking@drinking_shots@ped_a@normal", anim = "pour_one", flags = 16}, {}, {},
                    function()
                        QBCore.Functions.TriggerCallback("soz-jobs:server:bahamas:craft-item", function(success, reason)
                            if success then
                                exports["soz-hud"]:DrawNotification(string.format("Vous avez préparé ~g~1 %s", item.label))

                                TriggerServerEvent("monitor:server:event", "job_bam_cocktail_craft", {item_id = selectedCocktailId },
                                    {
                                        item_label = item.label,
                                        quantity = 1,
                                        position = GetEntityCoords(PlayerPedId()),
                                    }, true)
                            else
                                if reason == nil then
                                    return
                                elseif reason == "invalid_ingredient" then
                                    exports["soz-hud"]:DrawNotification("Il vous manque des ingrédients...", "error")
                                else
                                    exports["soz-hud"]:DrawNotification(string.format("Vous n'avez pas terminé votre préparation. Il y a eu une erreur : %s", reason),
                                        "error")
                                end
                            end
                        end, cocktailId)
                    end,
                    function()
                        exports["soz-hud"]:DrawNotification("Vous n'avez pas terminé votre préparation", "error")
                    end)
            end
        })

        recipesMenu:AddButton({
            label = cocktail.label,
            description = cocktail.description,
            --icon = cocktail.icon or ("https://nui-img/soz-items/" .. cocktail.name),
            value = ingredientsMenu
        })
    end
    BahamasJob.Menu:AddButton({ icon = "🍸", label = "Livre des recettes", value = recipesMenu })

    BahamasJob.Menu:Open()
end)

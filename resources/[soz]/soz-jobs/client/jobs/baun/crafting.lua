BaunJob.Functions.InitCraftingZones = function()
    --for _, config in ipairs(BaunConfig.CraftZones) do
    --    table.insert(BaunJob.Craft.Zones, BaunJob.Functions.ConfigToZone(config))
    --end
    --
    --BaunJob.Craft.ComboZone = ComboZone:Create(BaunJob.Craft.Zones,{ name = "bahamas:crafting"})
    --BaunJob.Craft.ComboZone:onPlayerInOut(function(isPointInside, _, _)
    --    --print("Is Point Inside: " .. json.encode(isPointInside))
    --    BaunJob.isInsideACraftingZone = isPointInside
    --end)
end

BaunJob.Functions.DestroyCraftingZones = function()
    for _, zone in ipairs(BaunJob.Craft.Zones) do
        zone:destroy()
    end
    if BaunJob.Craft.ComboZone then
        BaunJob.Craft.ComboZone:destroy()
    end
end

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if duty then
        BaunJob.Functions.InitCraftingZones()
    else
        BaunJob.Functions.DestroyCraftingZones()
    end
end)

AddEventHandler("jobs:client:bahamas:OpenSocietyMenu", function()
    if BaunJob.Menu.IsOpen then
        return
    end
    BaunJob.Menu:ClearItems()

    -- RECIPES
    local recipesMenu = MenuV:InheritMenu(BaunJob.Menu, { subtitle = "Livre des recettes" })
    for cocktailId, ingredients in pairs(BaunConfig.Recipes) do
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
                -- icon = item.icon or ("https://nui-img/soz-items/" .. item.name)
                description = item.description,
                value = hasTheRequiredQuantity,
                disabled = true,
            })
        end

        if BaunJob.isInsideACraftingZone then
            ingredientsMenu:AddButton({
                label = "Fabriquer le cocktail",
                disabled = not canCraft,
                select = function()
                    local item = QBCore.Shared.Items[cocktailId]
                    QBCore.Functions.Progressbar(
                        "food-craft-item", string.format("Vous préparez 1 %s", item.label),
                        BaunConfig.Durations.Crafting, false, true, {
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
        end

        recipesMenu:AddButton({
            label = cocktail.label,
            description = cocktail.description,
            --icon = cocktail.icon or ("https://nui-img/soz-items/" .. cocktail.name),
            value = ingredientsMenu
        })
    end
    BaunJob.Menu:AddButton({ icon = "🍸", label = "Livre des recettes", value = recipesMenu })

    BaunJob.Menu:Open()
end)

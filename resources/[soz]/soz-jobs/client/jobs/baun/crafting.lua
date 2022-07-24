BaunJob.Functions.InitCraftingZones = function()
    for _, config in ipairs(BaunConfig.CraftZones) do
        exports["qb-target"]:AddBoxZone(config.options.name, config.center, config.length, config.width, config.options, {
            options = {
                {
                    color = "baun",
                    type = "client",
                    label = "Confectionner",
                    icon = "c:baun/craft.png",
                    event = "soz-jobs:client:baun:OpenSocietyMenu",
                    blackoutGlobal = true,
                    blackoutJob = "baun",
                    job = "baun",
                    craftMode = true,
                    canInteract = function()
                        local hasPermission = SozJobCore.Functions.HasPermission("baun", SozJobCore.JobPermission.Baun.Craft)
                        return hasPermission and PlayerData.job.onduty
                    end,
                },
            },
            distance = 1.5,
        })
        table.insert(BaunJob.CraftZones, config.options.name)
    end
end

BaunJob.Functions.DestroyCraftingZones = function()
    for _, zone in ipairs(BaunJob.Craft.Zones) do
        zone:destroy()
    end
end

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if duty then
        BaunJob.Functions.InitCraftingZones()
    else
        BaunJob.Functions.DestroyCraftingZones()
    end
end)

AddEventHandler("soz-jobs:client:baun:OpenSocietyMenu", function(data)
    if BaunJob.Menu.IsOpen then
        return
    end
    BaunJob.Menu:ClearItems()

    -- RECIPES
    local recipesMenu = MenuV:InheritMenu(BaunJob.Menu, {subtitle = "Livre des recettes"})
    for cocktailId, ingredients in pairs(BaunConfig.Recipes) do
        local cocktail = QBCore.Shared.Items[cocktailId]
        local subtitle = "Ingrédients pour " .. cocktail.label
        local ingredientsMenu = MenuV:InheritMenu(recipesMenu, {subtitle = subtitle})
        local canCraft = true

        for _, ingredient in pairs(ingredients) do
            local item = QBCore.Shared.Items[ingredient.itemId]
            local hasTheRequiredQuantity = QBCore.Functions.TriggerRpc("inventory:server:Search", QBCore.Functions.GetPlayerData(), "amount", ingredient.itemId,
                                                                       nil) >= ingredient.quantity
            if not hasTheRequiredQuantity then
                canCraft = false
            end

            local label = item.label
            if ingredient.quantity > 1 then
                label = item.pluralLabel or (label .. "s")
            end

            ingredientsMenu:AddCheckbox({
                label = ingredient.quantity .. " " .. label,
                -- icon = item.icon or ("https://nui-img/soz-items/" .. item.name)
                description = item.description,
                value = hasTheRequiredQuantity,
                disabled = true,
            })
        end

        if data and data.craftMode == true then
            ingredientsMenu:AddButton({
                label = "Confectionner le cocktail",
                disabled = not canCraft,
                select = function()
                    ingredientsMenu:Close()
                    recipesMenu:Close()
                    BaunJob.Menu:Close()
                    TriggerEvent("soz-jobs:client:baun:craft", cocktailId)
                end,
            })
        end

        recipesMenu:AddButton({
            label = cocktail.label,
            description = cocktail.description,
            -- icon = cocktail.icon or ("https://nui-img/soz-items/" .. cocktail.name),
            value = ingredientsMenu,
        })
    end
    BaunJob.Menu:AddButton({icon = "🍸", label = "Livre des recettes", value = recipesMenu})

    BaunJob.Menu:Open()
end)

RegisterNetEvent("soz-jobs:client:baun:craft", function(cocktailId)
    local item = QBCore.Shared.Items[cocktailId]
    local action_message = string.format("Vous confectionnez 1 %s", item.label)
    local finished_message = string.format("Vous avez terminé de mélanger.", item.pluralLabel)
    QBCore.Functions.Progressbar("food-craft-item", action_message, BaunConfig.Durations.Crafting, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@amb@nightclub@mini@drinking@drinking_shots@ped_a@normal", anim = "pour_one", flags = 0}, {}, {}, function()
        QBCore.Functions.TriggerCallback("soz-jobs:server:baun:craft", function(success, reason)
            if success then
                TriggerServerEvent("monitor:server:event", "job_bam_cocktail_craft", {item_id = cocktailId},
                                   {item_label = item.label, quantity = 1, position = GetEntityCoords(PlayerPedId())}, true)
                TriggerEvent("soz-jobs:client:baun:craft", cocktailId)
            else
                if reason == nil or reason == "missing_ingredient" or reason == "invalid_weight" then
                    exports["soz-hud"]:DrawNotification(finished_message)
                    return
                end
                exports["soz-hud"]:DrawNotification(string.format("Vous n'avez pas terminé votre préparation. Il y a eu une erreur : %s", reason), "error")
            end
        end, cocktailId)
    end, function()
        exports["soz-hud"]:DrawNotification(finished_message)
    end)
end)

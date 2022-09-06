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
    for _, zoneName in ipairs(BaunJob.CraftZones) do
        exports["qb-target"]:RemoveZone(zoneName)
    end
end

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if duty then
        BaunJob.Functions.InitCraftingZones()
    else
        BaunJob.Functions.DestroyCraftingZones()
    end
end)

BaunJob.RecipeBook = {}

CreateThread(function()
    for cocktailId, ingredients in pairs(BaunConfig.Recipes) do
        local cocktail = QBCore.Shared.Items[cocktailId]
        if cocktail == nil then
            print("Cocktail '" .. cocktailId "' has not been found.")
        end
        local cocktailToInsert = {id = cocktailId, label = cocktail.label, ingredients = {}}

        for _, ingredient in pairs(ingredients) do
            local item = QBCore.Shared.Items[ingredient.itemId]
            if item == nil then
                print("Ingredient '" .. ingredient.itemId "' has not been found.")
            end
            local label = item.label
            if ingredient.quantity > 1 then
                label = item.pluralLabel or (label .. "s")
            end
            table.insert(cocktailToInsert.ingredients,
                         {
                itemId = ingredient.itemId,
                label = label,
                description = item.description,
                quantity = ingredient.quantity,
            })
        end

        table.sort(cocktailToInsert.ingredients, function(a, b)
            return a.label < b.label
        end)

        table.insert(BaunJob.RecipeBook, cocktailToInsert)
    end
    table.sort(BaunJob.RecipeBook, function(a, b)
        return a.label < b.label
    end)
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

RegisterNetEvent("soz-jobs:client:baun:createCocktailBox", function()
    QBCore.Functions.TriggerCallback("soz-jobs:server:baun:createCocktailBox", function(success, reason)
        print(success)
    end)
end)

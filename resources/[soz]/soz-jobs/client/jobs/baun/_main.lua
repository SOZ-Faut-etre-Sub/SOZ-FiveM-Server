QBCore = exports["qb-core"]:GetCoreObject()

BaunJob = {}
BaunJob.Functions = {}
BaunJob.MenuState = {}
BaunJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_baun", "soz", "baun:menu")

BaunJob.Harvest = {}
BaunJob.CraftZones = {}

RegisterNetEvent("jobs:client:baun:OpenCloakroomMenu", function()
    SozJobCore.Functions.OpenCloakroomMenu(BaunJob.Menu, BaunConfig.Cloakroom.Clothes)
end)

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() == resourceName and GetConvarInt("feature_msb_baun", 0) == 1) then
        for _, config in pairs(BaunConfig.Blips) do
            QBCore.Functions.CreateBlip(config.Id, {
                name = config.Name,
                coords = config.Coords,
                sprite = config.Icon,
                scale = config.Scale,
            })
        end

        for _, zone in pairs(BaunConfig.Cloakroom.Zones) do
            exports["qb-target"]:AddBoxZone(zone.options.name, zone.center, zone.length, zone.width, zone.options, {
                options = {
                    {
                        label = "S'habiller",
                        icon = "c:jobs/habiller.png",
                        event = "jobs:client:baun:OpenCloakroomMenu",
                        job = "baun",
                        canInteract = function()
                            return PlayerData.job.onduty
                        end,
                    },
                },
                distance = 2.5,
            })
        end

        BaunJob.Functions.InitHarvestingZones()
    end
end)

AddEventHandler("onClientResourceStop", function(resourceName)
    if (GetCurrentResourceName() == resourceName and GetConvarInt("feature_msb_baun", 0) == 1) then
        BaunJob.Functions.DestroyHarvestingZones()
    end
end)

AddEventHandler("soz-jobs:client:baun:OpenSocietyMenu", function(data)
    if BaunJob.Menu.IsOpen then
        return
    end
    BaunJob.Menu:ClearItems()

    -- RECIPES
    local recipesMenu = MenuV:InheritMenu(BaunJob.Menu, {subtitle = "Livre des recettes"})
    local items = QBCore.Functions.TriggerRpc("inventory:server:GetInventoryItems")

    for cocktailId, cocktail in pairs(BaunJob.RecipeBook) do
        local subtitle = "Ingrédients pour " .. cocktail.label
        local ingredientsMenu = MenuV:InheritMenu(recipesMenu, {subtitle = subtitle})
        local canCraft = true

        for _, ingredient in pairs(cocktail.ingredients) do
            local hasTheRequiredQuantity = getItem(items, ingredient.itemId).amount >= ingredient.quantity
            if not hasTheRequiredQuantity then
                canCraft = false
            end

            ingredientsMenu:AddCheckbox({
                label = ingredient.quantity .. " " .. ingredient.label,
                -- icon = item.icon or ("https://nui-img/soz-items/" .. item.name)
                description = ingredient.description,
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

    BaunJob.Menu:AddCheckbox({
        label = "Afficher la récolte d'alcools",
        value = BaunJob.MenuState.ffs_liquor,
        select = function(_, value)
            BaunJob.MenuState.ffs_liquor = value
            if not QBCore.Functions.GetBlip("ffs_liquor") then
                QBCore.Functions.CreateBlip("ffs_liquor",
                    {
                        name = "Point de récolte d'alcool",
                        coords = vector3(2793.73, 1524.45, 24.52),
                        sprite = 436,
                        scale = 1.0,
                    })
            end

            QBCore.Functions.HideBlip("ffs_liquor", not value)
        end
    })

    BaunJob.Menu:AddCheckbox({
        label = "Afficher la récolte de saveurs",
        value = BaunJob.MenuState.ffs_flavor,
        select = function(_, value)
            BaunJob.MenuState.ffs_flavor = value
            if not QBCore.Functions.GetBlip("ffs_flavor") then
                QBCore.Functions.CreateBlip("ffs_flavor",
                    {
                        name = "Point de récolte de saveurs",
                        coords = vector3(2793.73, 1524.45, 24.52),
                        sprite = 436,
                        scale = 1.0,
                    })
            end

            QBCore.Functions.HideBlip("ffs_flavor", not value)
        end
    })

    BaunJob.Menu:AddCheckbox({
        label = "Afficher la récolte de fournitures",
        value = BaunJob.MenuState.ffs_furniture,
        select = function(_, value)
            BaunJob.MenuState.ffs_furniture = value
            if not QBCore.Functions.GetBlip("ffs_furniture") then
                QBCore.Functions.CreateBlip("ffs_furniture",
                    {
                        name = "Point de récolte de fournitures",
                        coords = vector3(2793.73, 1524.45, 24.52),
                        sprite = 436,
                        scale = 1.0,
                    })
            end

            QBCore.Functions.HideBlip("ffs_furniture", not value)
        end
    })

    BaunJob.Menu:Open()
end)

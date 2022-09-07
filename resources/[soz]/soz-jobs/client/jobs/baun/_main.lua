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

local function getItem(items, itemId)
    for _, item in ipairs(items) do
        if item.name == itemId then
            return item
        end
    end
    return {amount = 0}
end

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

    for _, cocktail in pairs(BaunJob.RecipeBook) do
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
                    TriggerEvent("soz-jobs:client:baun:craft", cocktail.id)
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
        value = BaunJob.MenuState["baun_liquor"],
        change = function(_, value)
            BaunJob.MenuState["baun_liquor"] = value
            if not QBCore.Functions.GetBlip("baun_liquor") then
                QBCore.Functions.CreateBlip("baun_liquor", {
                    name = "Point de récolte d'alcool",
                    coords = vector3(1410.96, 1147.6, 114.33),
                    sprite = 478,
                    color = 28,
                    scale = 1.0,
                })
            end

            QBCore.Functions.HideBlip("baun_liquor", not value)
        end,
    })

    BaunJob.Menu:AddCheckbox({
        label = "Afficher la récolte de saveurs",
        value = BaunJob.MenuState["baun_flavor"],
        change = function(_, value)
            BaunJob.MenuState["baun_flavor"] = value
            if not QBCore.Functions.GetBlip("baun_flavor") then
                QBCore.Functions.CreateBlip("baun_flavor", {
                    name = "Point de récolte de saveurs",
                    coords = vector3(867.17, -1628.59, 30.2),
                    sprite = 478,
                    color = 28,
                    scale = 1.0,
                })
            end

            QBCore.Functions.HideBlip("baun_flavor", not value)
        end,
    })

    BaunJob.Menu:AddCheckbox({
        label = "Afficher la récolte de fournitures",
        value = BaunJob.MenuState["baun_furniture"],
        change = function(_, value)
            BaunJob.MenuState["baun_furniture"] = value
            if not QBCore.Functions.GetBlip("baun_furniture") then
                QBCore.Functions.CreateBlip("baun_furniture", {
                    name = "Point de récolte de fournitures",
                    coords = vector3(44.98, -1749.42, 29.59),
                    sprite = 478,
                    color = 28,
                    scale = 1.0,
                })
            end

            QBCore.Functions.HideBlip("baun_furniture", not value)
        end,
    })

    BaunJob.Menu:AddCheckbox({
        label = "Afficher la revente des cocktails",
        value = BaunJob.MenuState["baun_resell"],
        change = function(_, value)
            BaunJob.MenuState["baun_resell"] = value
            if not QBCore.Functions.GetBlip("baun_resell") then
                QBCore.Functions.CreateBlip("baun_resell", {
                    name = "Point de vente des cocktails",
                    coords = vector3(393.02, 177.3, 103.86),
                    sprite = 605,
                    color = 28,
                    scale = 1.0,
                })
            end

            QBCore.Functions.HideBlip("baun_resell", not value)
        end,
    })

    BaunJob.Menu:Open()
end)

exports["qb-target"]:AddBoxZone("baun:bahama:duty", vector3(-1388.11, -606.23, 30.32), 0.55, 0.55,
                                {name = "baun:bahama:duty", heading = 16, minZ = 30.32, maxZ = 30.87},
                                {options = SozJobCore.Functions.GetDutyActions("baun"), distance = 2.5})

exports["qb-target"]:AddBoxZone("baun:unicorn:duty", vector3(133.53, -1286.86, 29.27), 0.45, 0.5,
                                {name = "baun:unicorn:duty", heading = 345, minZ = 29.27, maxZ = 29.67},
                                {options = SozJobCore.Functions.GetDutyActions("baun"), distance = 2.5})
